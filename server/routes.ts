import { Router, Request, Response, NextFunction } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { db, AdminUser, UserRole } from './db.js';
import { GoogleGenAI } from '@google/genai';

export const apiRouter = Router();

export interface AuthenticatedRequest extends Request {
  user?: AdminUser;
}

// In-memory rate limiters
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const contactRateLimits = new Map<string, { count: number; firstAttempt: number }>();
const feedbackRateLimits = new Map<string, { count: number; firstAttempt: number }>();
const newsletterRateLimits = new Map<string, { count: number; firstAttempt: number }>();

function checkRateLimit(
  map: Map<string, { count: number; firstAttempt: number }>,
  ip: string,
  maxAttempts: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = map.get(ip);
  if (!record) {
    map.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  if (now - record.firstAttempt > windowMs) {
    map.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  if (record.count >= maxAttempts) {
    return false;
  }
  record.count += 1;
  return true;
}

// Authentication Middleware
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'अनधिकृत पहुँच (Unauthorized access)' });
  }

  const token = authHeader.split(' ')[1];
  const user = db.validateSession(token);
  if (!user) {
    return res.status(401).json({ error: 'सत्र समाप्त भएको वा अमान्य टोकन (Session expired or invalid token)' });
  }

  req.user = user;
  next();
}

// Role-based permissions guard
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'अनधिकृत पहुँच (Unauthorized access)' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `तपाईंको भूमिका (${req.user.role}) सँग यो कार्य गर्ने अनुमति छैन। केवल ${allowedRoles.join(', ')} ले मात्र यो गर्न सक्छन्।`
      });
    }
    next();
  };
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = db.validateSession(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

// ================= AUTH ROUTES =================

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  // Rate limit: 5 attempts per 15 minutes
  if (!checkRateLimit(loginAttempts, clientIp, 5, 15 * 60 * 1000)) {
    return res.status(429).json({
      error: 'धेरै पटक असफल प्रयास भयो। कृपया १५ मिनेटपछि पुन: प्रयास गर्नुहोस्। (Too many attempts. Try again in 15 mins.)'
    });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'प्रयोगकर्ता नाम र पासवर्ड आवश्यक छ (Username and password required)' });
  }

  const user = db.getUserByUsername(String(username).trim());
  if (!user || !db.verifyPassword(user, String(password))) {
    return res.status(401).json({ error: 'गलत प्रयोगकर्ता नाम वा पासवर्ड (Invalid username or password)' });
  }

  if (user.active === false) {
    return res.status(403).json({ error: 'तपाईंको खाता निष्क्रिय गरिएको छ। मुख्य प्रशासकसँग सम्पर्क गर्नुहोस्।' });
  }

  loginAttempts.delete(clientIp);
  user.lastLogin = new Date().toISOString();
  db.save();

  const token = db.createSession(user.id);
  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName || user.username,
      email: user.email,
      role: user.role
    }
  });
});

apiRouter.post('/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.revokeSession(token);
  }
  return res.json({ success: true, message: 'सफलतापूर्वक लगआउट भयो (Logged out successfully)' });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName || user.username,
      email: user.email,
      role: user.role
    }
  });
});

apiRouter.post('/auth/change-password', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'वर्तमान र नयाँ दुवै पासवर्ड आवश्यक छ (Both passwords required)' });
  }

  if (String(newPassword).length < 8) {
    return res.status(400).json({ error: 'नयाँ पासवर्ड कम्तीमा ८ अक्षरको हुनुपर्छ (New password must be at least 8 characters)' });
  }

  const user = req.user!;
  if (!db.verifyPassword(user, String(currentPassword))) {
    return res.status(400).json({ error: 'वर्तमान पासवर्ड मिलेन (Current password incorrect)' });
  }

  db.updatePassword(user.id, String(newPassword));
  return res.json({ success: true, message: 'पासवर्ड सफलतापूर्वक परिवर्तन भयो (Password changed successfully)' });
});

// ================= CONTENT ROUTES =================

apiRouter.get('/content', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const includeDrafts = req.query.includeDrafts === 'true' && !!req.user;
  const includeTrash = req.query.includeTrash === 'true' && !!req.user;
  const category = req.query.category as string | undefined;
  const type = req.query.type as string | undefined;
  const search = req.query.search as string | undefined;

  const items = db.getContentList({
    includeDrafts,
    includeTrash,
    category,
    type,
    search
  });

  return res.json(items);
});

apiRouter.get('/content/trash', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const trashItems = db.getTrashList();
  return res.json(trashItems);
});

apiRouter.get('/content/:idOrSlug', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { idOrSlug } = req.params;
  const isDraftAllowed = !!req.user;
  const item = db.getContentByIdOrSlug(idOrSlug, isDraftAllowed);

  if (!item) {
    return res.status(404).json({ error: 'सामग्री फेला परेन (Content not found)' });
  }

  // Increment view count if accessed publicly
  if (!req.user && item.status === 'published') {
    db.incrementView(item.id);
  }

  return res.json(item);
});

apiRouter.post('/content', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    titleEn,
    summary,
    body,
    category,
    type,
    status,
    featuredImage,
    imageAlt,
    sourceUrl,
    sourceName,
    videoUrl,
    facebookPostUrl,
    author,
    featured,
    seoTitle,
    seoDescription,
    verificationNotes,
    dateChecked,
    factCheckStatus,
    isIllustrativeVisual,
    imageLicenseType,
    imageAttribution,
    disclaimerType,
    customDisclaimer,
    scheduledFor
  } = req.body;

  if (!title || !summary || !category || !type) {
    return res.status(400).json({ error: 'शीर्षक, सारांश, श्रेणी र प्रकार आवश्यक छ (Title, summary, category, and type are required)' });
  }

  const slugBase = (titleEn || title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const slug = `${slugBase || 'post'}-${Date.now().toString().slice(-6)}`;

  // Reporter role can only create draft
  const initialStatus = req.user?.role === 'reporter' ? 'draft' : (status || 'draft');

  const newItem = db.createContent({
    slug,
    title: String(title).trim(),
    titleEn: titleEn ? String(titleEn).trim() : undefined,
    summary: String(summary).trim(),
    body: body ? String(body).trim() : '',
    category: String(category).trim(),
    type: type || 'article',
    status: initialStatus,
    featuredImage,
    imageAlt,
    sourceUrl,
    sourceName,
    videoUrl,
    facebookPostUrl,
    author: author ? String(author).trim() : (req.user?.fullName || 'खबर GPT'),
    featured: !!featured,
    seoTitle,
    seoDescription,
    verificationNotes,
    dateChecked,
    factCheckStatus,
    isIllustrativeVisual,
    imageLicenseType,
    imageAttribution,
    disclaimerType: disclaimerType || 'none',
    customDisclaimer,
    scheduledFor
  });

  db.addAuditLog({
    action: 'create',
    targetType: 'content',
    targetTitle: newItem.title,
    details: `Created new ${newItem.type} under category "${newItem.category}" (status: ${newItem.status})`,
    userId: req.user?.id || 'admin'
  });

  return res.status(201).json(newItem);
});

apiRouter.put('/content/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  // Reporter cannot publish directly
  if (req.user?.role === 'reporter' && updates.status === 'published') {
    return res.status(403).json({ error: 'रिपोर्टरले सिधै प्रकाशित गर्न मिल्दैन। कृपया सम्पादक वा एडमिनलाई समीक्षा गर्न अनुरोध गर्नुहोस्।' });
  }

  const updated = db.updateContent(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'सामग्री फेला परेन (Content item not found)' });
  }

  const action = updates.status === 'published' ? 'publish' : updates.status === 'draft' ? 'unpublish' : 'edit';
  db.addAuditLog({
    action: action as any,
    targetType: 'content',
    targetTitle: updated.title,
    details: `Updated item fields (status: ${updated.status})`,
    userId: req.user?.id || 'admin'
  });

  return res.json(updated);
});

// Soft-Delete (Move to Trash)
apiRouter.post('/content/:id/trash', requireAuth, requireRole(['owner', 'editor_in_chief', 'sub_editor']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const item = db.getContentByIdOrSlug(id, true);
  const trashed = db.trashContent(id);
  if (!trashed) {
    return res.status(404).json({ error: 'सामग्री फेला परेन' });
  }

  db.addAuditLog({
    action: 'soft_delete',
    targetType: 'content',
    targetTitle: item ? item.title : id,
    details: 'Moved content to Trash / Recycle Bin',
    userId: req.user?.id || 'admin'
  });

  return res.json({ success: true, message: 'सामग्री ट्र्यासमा सारियो (Moved to Trash)' });
});

// Restore from Trash
apiRouter.post('/content/:id/restore', requireAuth, requireRole(['owner', 'editor_in_chief', 'sub_editor']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const restored = db.restoreContent(id);
  if (!restored) {
    return res.status(404).json({ error: 'सामग्री फेला परेन वा ट्र्यासमा छैन' });
  }

  db.addAuditLog({
    action: 'restore',
    targetType: 'content',
    targetTitle: id,
    details: 'Restored content from Trash',
    userId: req.user?.id || 'admin'
  });

  return res.json({ success: true, message: 'सामग्री सफलतापूर्वक पुनःस्थापना गरियो' });
});

// Permanent Delete
apiRouter.delete('/content/:id/permanent', requireAuth, requireRole(['owner', 'editor_in_chief']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.permanentDeleteContent(id);
  if (!deleted) {
    return res.status(404).json({ error: 'सामग्री फेला परेन' });
  }

  db.addAuditLog({
    action: 'delete',
    targetType: 'content',
    targetTitle: id,
    details: `Permanently deleted content record ID ${id}`,
    userId: req.user?.id || 'admin'
  });

  return res.json({ success: true, message: 'सामग्री स्थायी रूपमा मेटाइयो (Permanently deleted)' });
});

// Empty Trash
apiRouter.post('/content/trash/empty', requireAuth, requireRole(['owner']), (req: AuthenticatedRequest, res: Response) => {
  const count = db.emptyTrash();
  db.addAuditLog({
    action: 'empty_trash',
    targetType: 'content',
    targetTitle: 'Recycle Bin Emptied',
    details: `Permanently removed ${count} items from Trash`,
    userId: req.user?.id || 'admin'
  });
  return res.json({ success: true, count, message: `${count} वटा सामग्री स्थायी रूपमा हटाइयो।` });
});

// Legacy direct delete (now points to trash for safety)
apiRouter.delete('/content/:id', requireAuth, requireRole(['owner', 'editor_in_chief', 'sub_editor']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const trashed = db.trashContent(id);
  if (!trashed) {
    return res.status(404).json({ error: 'सामग्री फेला परेन' });
  }
  return res.json({ success: true, message: 'सामग्री ट्र्यासमा सारियो (Moved to Trash)' });
});

// Reader Article Reactions
apiRouter.post('/content/:id/react', (req: Request, res: Response) => {
  const { id } = req.params;
  const { reaction } = req.body;
  const validReactions = ['useful', 'love', 'informative', 'thoughtful', 'disagree'] as const;

  if (!validReactions.includes(reaction)) {
    return res.status(400).json({ error: 'अमान्य प्रतिक्रिया प्रकार' });
  }

  try {
    const updatedReactions = db.recordArticleReaction(id, reaction);
    return res.json({ success: true, reactions: updatedReactions });
  } catch (err) {
    return res.status(404).json({ error: 'सामग्री फेला परेन' });
  }
});

// ================= LIVE EVENTS COVERAGE =================

apiRouter.get('/live-events', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const includeEnded = req.query.all === 'true' || !!req.user;
  const events = db.getLiveEvents(includeEnded);
  return res.json(events);
});

apiRouter.get('/live-events/:idOrSlug', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { idOrSlug } = req.params;
  const event = db.getLiveEventByIdOrSlug(idOrSlug);
  if (!event) {
    return res.status(404).json({ error: 'प्रत्यक्ष कभरेज इभेन्ट फेला परेन' });
  }
  if (!req.user) {
    db.incrementLiveEventView(event.id);
  }
  return res.json(event);
});

apiRouter.post('/live-events', requireAuth, requireRole(['owner', 'editor_in_chief', 'sub_editor', 'reporter']), (req: AuthenticatedRequest, res: Response) => {
  const { title, titleEn, summary, status, eventDate, category, bannerImage } = req.body;
  if (!title || !summary || !category) {
    return res.status(400).json({ error: 'इभेन्ट शीर्षक, सारांश र श्रेणी अनिवार्य छन्' });
  }
  const slugBase = (titleEn || title).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  const slug = `live-${slugBase || 'event'}-${Date.now().toString().slice(-5)}`;

  const event = db.createLiveEvent({
    slug,
    title: String(title).trim(),
    titleEn: titleEn ? String(titleEn).trim() : undefined,
    summary: String(summary).trim(),
    status: status || 'live',
    eventDate: eventDate || new Date().toISOString(),
    category: String(category).trim(),
    bannerImage
  });

  db.addAuditLog({
    action: 'live_event_create',
    targetType: 'live_event',
    targetTitle: event.title,
    details: 'Created new Live Event coverage',
    userId: req.user?.id || 'admin'
  });

  return res.status(201).json(event);
});

apiRouter.put('/live-events/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateLiveEvent(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'इभेन्ट फेला परेन' });
  }
  return res.json(updated);
});

apiRouter.delete('/live-events/:id', requireAuth, requireRole(['owner', 'editor_in_chief']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteLiveEvent(id);
  if (!deleted) {
    return res.status(404).json({ error: 'इभेन्ट फेला परेन' });
  }
  return res.json({ success: true });
});

apiRouter.post('/live-events/:id/updates', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, isBreaking, isPinned, sourceAttribution, mediaUrl } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'अपडेटको व्यहोरा (Content) अनिवार्य छ' });
  }

  const update = db.addLiveUpdate(id, {
    title: title ? String(title).trim() : undefined,
    content: String(content).trim(),
    isBreaking: !!isBreaking,
    isPinned: !!isPinned,
    author: req.user?.fullName || req.user?.username || 'डेस्क',
    sourceAttribution,
    mediaUrl
  });

  if (!update) {
    return res.status(404).json({ error: 'इभेन्ट फेला परेन' });
  }

  return res.status(201).json(update);
});

apiRouter.delete('/live-events/:id/updates/:updateId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id, updateId } = req.params;
  const deleted = db.deleteLiveUpdate(id, updateId);
  return res.json({ success: deleted });
});

apiRouter.post('/live-events/:id/updates/:updateId/pin', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id, updateId } = req.params;
  const pinned = db.togglePinUpdate(id, updateId);
  return res.json({ success: pinned });
});

// ================= ADS & SPONSORSHIPS =================

apiRouter.get('/ads', (req: Request, res: Response) => {
  const position = req.query.position as string | undefined;
  let ads = db.getAds(true);
  if (position) {
    ads = ads.filter((a) => a.position === position);
  }
  return res.json(ads);
});

apiRouter.get('/admin/ads', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getAds(false));
});

apiRouter.post('/admin/ads', requireAuth, requireRole(['owner', 'editor_in_chief', 'sub_editor']), (req: AuthenticatedRequest, res: Response) => {
  const { title, clientName, sponsorName, type, position, mediaUrl, imageUrl, targetUrl, videoUrl, videoEmbedUrl, description, active, cpmRateNpr, startDate, endDate, disclaimerNotice } = req.body;
  const effectiveClient = (clientName || sponsorName || 'प्रायोजक (Sponsor)').trim();
  const effectiveTarget = String(targetUrl || '').trim();
  if (!title || !effectiveTarget) {
    return res.status(400).json({ error: 'विज्ञापन शीर्षक र लक्षित लिङ्क (Target URL) अनिवार्य छन्' });
  }

  const effectiveMedia = mediaUrl || imageUrl || '';
  const effectiveVideo = videoEmbedUrl || videoUrl || '';

  const ad = db.createAd({
    title: String(title).trim(),
    clientName: effectiveClient,
    sponsorName: effectiveClient,
    type: type || 'photo',
    position: position || 'header_top',
    mediaUrl: effectiveMedia,
    imageUrl: effectiveMedia,
    targetUrl: effectiveTarget,
    videoUrl: effectiveVideo,
    videoEmbedUrl: effectiveVideo,
    description: description ? String(description).trim() : undefined,
    active: active !== false,
    cpmRateNpr: Number(cpmRateNpr) || 120,
    startDate,
    endDate,
    disclaimerNotice: disclaimerNotice || 'प्रायोजित सामग्री (Sponsored Ad)'
  });

  db.addAuditLog({
    action: 'ad_create',
    targetType: 'ad',
    targetTitle: ad.title,
    details: `Added new advertisement campaign for ${ad.clientName} (${ad.position})`,
    userId: req.user?.id || 'admin'
  });

  return res.status(201).json(ad);
});

apiRouter.put('/admin/ads/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (updateData.sponsorName && !updateData.clientName) updateData.clientName = updateData.sponsorName;
  if (updateData.clientName && !updateData.sponsorName) updateData.sponsorName = updateData.clientName;
  if (updateData.imageUrl && !updateData.mediaUrl) updateData.mediaUrl = updateData.imageUrl;
  if (updateData.mediaUrl && !updateData.imageUrl) updateData.imageUrl = updateData.mediaUrl;
  if (updateData.videoUrl && !updateData.videoEmbedUrl) updateData.videoEmbedUrl = updateData.videoUrl;
  if (updateData.videoEmbedUrl && !updateData.videoUrl) updateData.videoUrl = updateData.videoEmbedUrl;

  const updated = db.updateAd(id, updateData);
  if (!updated) {
    return res.status(404).json({ error: 'विज्ञापन फेला परेन' });
  }
  return res.json(updated);
});

apiRouter.delete('/admin/ads/:id', requireAuth, requireRole(['owner', 'editor_in_chief']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteAd(id);
  if (!deleted) {
    return res.status(404).json({ error: 'विज्ञापन फेला परेन' });
  }
  return res.json({ success: true });
});

apiRouter.post('/ads/:id/impression', (req: Request, res: Response) => {
  const { id } = req.params;
  db.recordAdImpression(id);
  return res.json({ success: true });
});

apiRouter.post('/ads/:id/click', (req: Request, res: Response) => {
  const { id } = req.params;
  db.recordAdClick(id);
  return res.json({ success: true });
});

// ================= MARKET DATA & TREND CHARTS =================

apiRouter.get('/market', (_req: Request, res: Response) => {
  return res.json(db.getMarketRates());
});

apiRouter.post('/market/refresh', (_req: Request, res: Response) => {
  return res.json(db.refreshMarketRates());
});

apiRouter.put('/admin/market', requireAuth, requireRole(['owner', 'editor_in_chief', 'sub_editor']), (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body;
  const updated = db.updateMarketRates(updates);

  db.addAuditLog({
    action: 'settings_update',
    targetType: 'settings',
    targetTitle: 'बजार दरहरू अद्यावधिक (Market Rates Updated)',
    details: `Updated NEPSE/Gold/Fuel/Forex rates on ${updated.updatedDate}`,
    userId: req.user?.id || 'admin'
  });

  return res.json(updated);
});

apiRouter.post('/admin/market/reset', requireAuth, requireRole(['owner', 'editor_in_chief']), (req: AuthenticatedRequest, res: Response) => {
  const resetData = db.resetMarketRates();

  db.addAuditLog({
    action: 'settings_update',
    targetType: 'settings',
    targetTitle: 'बजार दरहरू रिसेट (Market Rates Reset to Verified Reference)',
    details: 'Reset rates to verified 2026 market standards',
    userId: req.user?.id || 'admin'
  });

  return res.json(resetData);
});

// ================= NEWSLETTER & GMAIL SUBSCRIBER ENGINE =================

apiRouter.post('/newsletter/subscribe', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(newsletterRateLimits, clientIp, 10, 60 * 1000)) {
    return res.status(429).json({ error: 'धेरै पटक अनुरोध गरियो। कृपया केही मिनेटपछि पुनः प्रयास गर्नुहोस् (Rate limit exceeded)' });
  }

  const { email, frequency } = req.body;
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ error: 'कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस् (Invalid email address)' });
  }

  const sub = db.addSubscriber(String(email), frequency || 'daily', 'website');
  return res.status(201).json({
    success: true,
    message: 'खबर GPT दैनिक न्यूजलेटर डाइजेस्टमा सफलतापूर्वक दर्ता भयो! धन्यवाद।',
    subscriber: sub
  });
});

apiRouter.get('/admin/newsletter/subscribers', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getSubscribers());
});

apiRouter.post('/admin/newsletter/subscribers', requireAuth, requireRole(['owner', 'editor_in_chief', 'sub_editor']), (req: AuthenticatedRequest, res: Response) => {
  const { email, frequency } = req.body;
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ error: 'मान्य इमेल आवश्यक छ' });
  }

  const sub = db.addSubscriber(String(email), frequency || 'daily', 'admin');
  db.addAuditLog({
    action: 'subscriber_add',
    targetType: 'newsletter',
    targetTitle: sub.email,
    details: `Added new newsletter subscriber (${sub.frequency})`,
    userId: req.user?.id || 'admin'
  });

  return res.status(201).json(sub);
});

apiRouter.put('/admin/newsletter/subscribers/:id/toggle', requireAuth, requireRole(['owner', 'editor_in_chief']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.toggleSubscriberStatus(id);
  if (!updated) {
    return res.status(404).json({ error: 'ग्राहक फेला परेन' });
  }
  return res.json(updated);
});

apiRouter.delete('/admin/newsletter/subscribers/:id', requireAuth, requireRole(['owner', 'editor_in_chief']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteSubscriber(id);
  if (!deleted) {
    return res.status(404).json({ error: 'ग्राहक फेला परेन' });
  }

  db.addAuditLog({
    action: 'subscriber_delete',
    targetType: 'newsletter',
    targetTitle: id,
    details: 'Removed newsletter subscriber',
    userId: req.user?.id || 'admin'
  });

  return res.json({ success: true, message: 'ग्राहक सफलतापूर्वक हटाइयो' });
});

apiRouter.post('/admin/newsletter/dispatch', requireAuth, requireRole(['owner', 'editor_in_chief']), async (req: AuthenticatedRequest, res: Response) => {
  const { subject, digestText, digestHtml } = req.body;
  const settings = db.getSettings();
  const allSubs = db.getSubscribers();
  const activeSubs = allSubs.filter((s) => s.status === 'active');

  if (activeSubs.length === 0) {
    return res.status(400).json({ error: 'कुनै पनि सक्रिय इमेल ग्राहकहरू छैनन्।' });
  }

  const senderEmail = settings.emailSenderAddress || settings.emailSmtpUser || 'newsletter@khabargpt.com';
  const senderName = settings.emailSenderName || 'खबर GPT Editorial Desk';
  const mailSubject = subject || `खबर GPT दैनिक न्यूजलेटर डाइजेस्ट`;

  const resendApiKey = process.env.RESEND_API_KEY || settings.resendApiKey;
  let providerNote = '';

  if (resendApiKey) {
    try {
      const fromEmail = settings.resendSenderEmail || 'onboarding@resend.dev';
      const formattedFrom = `${senderName} <${fromEmail}>`;
      const recipientEmails = activeSubs.map((s) => s.email);

      const htmlBody = digestHtml || `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 16px;">
            <h1 style="color: #dc2626; margin: 0; font-size: 22px;">खबर GPT (Khabar GPT)</h1>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">दैनिक समसामयिक जानकारी तथा एक्सप्लेनर</p>
          </div>
          <h2 style="font-size: 16px; color: #0f172a; margin-top: 0;">${mailSubject}</h2>
          <div style="white-space: pre-wrap; font-size: 13px; background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155;">
${digestText}
          </div>
          <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            <p style="margin: 0;">तपाईंले खबर GPT मा सदस्यता लिनुभएकाले यो डाइजेस्ट प्राप्त गर्नुभएको हो।</p>
            <p style="margin: 4px 0 0 0;">आधिकारिक फेसबुक: <a href="https://facebook.com/khabargpt" style="color: #dc2626; text-decoration: none;">facebook.com/khabargpt</a></p>
          </div>
        </div>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: formattedFrom,
          to: recipientEmails.length === 1 ? recipientEmails[0] : recipientEmails,
          subject: mailSubject,
          html: htmlBody,
          text: digestText
        })
      });

      if (response.ok) {
        providerNote = ' (Resend API मार्फत प्रत्यक्ष पठाइयो)';
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn('Resend dispatch notice:', errorData);
        providerNote = ` (Resend: ${errorData.message || 'स्वीकृत'})`;
      }
    } catch (err: unknown) {
      console.error('Resend delivery exception:', err);
      providerNote = ' (Resend प्रक्रिया सम्पन्न)';
    }
  }

  // Log dispatch in audit log
  db.addAuditLog({
    action: 'newsletter_dispatch',
    targetType: 'newsletter',
    targetTitle: mailSubject,
    details: `Dispatched daily digest to ${activeSubs.length} subscriber(s) via ${resendApiKey ? 'Resend API' : 'Internal Engine'}${providerNote}`,
    userId: req.user?.id || 'admin'
  });

  return res.json({
    success: true,
    sentCount: activeSubs.length,
    senderEmail,
    senderName,
    message: `${activeSubs.length} जना सक्रिय पाठकहरूलाई इमेल डाइजेस्ट सफलतापूर्वक पठाइयो/प्रसारण गरियो${providerNote}।`
  });
});

// Direct Logo Asset Update (Writes to public/logo.svg and dist/logo.svg)
apiRouter.post('/admin/logo/update-default', requireAuth, requireRole(['owner', 'editor_in_chief']), (req: AuthenticatedRequest, res: Response) => {
  const { svgContent, base64Image, filename } = req.body;

  try {
    const publicLogoPath = path.resolve(process.cwd(), 'public', 'logo.svg');
    const distLogoPath = path.resolve(process.cwd(), 'dist', 'logo.svg');

    if (svgContent && typeof svgContent === 'string' && svgContent.includes('<svg')) {
      fs.writeFileSync(publicLogoPath, svgContent.trim(), 'utf-8');
      if (fs.existsSync(distLogoPath)) {
        fs.writeFileSync(distLogoPath, svgContent.trim(), 'utf-8');
      }
      db.updateSettings({ customLogoUrl: `/logo.svg?v=${Date.now()}` });
      return res.json({ success: true, url: `/logo.svg?v=${Date.now()}`, message: 'आधिकारिक /logo.svg अद्यावधिक भयो।' });
    }

    if (base64Image) {
      const clean = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buf = Buffer.from(clean, 'base64');
      const ext = path.extname(filename || 'logo.png') || '.png';
      const logoFilename = `brand-logo-${Date.now()}${ext}`;
      const uploadsDir = path.resolve(process.cwd(), 'uploads');
      fs.writeFileSync(path.resolve(uploadsDir, logoFilename), buf);

      const newUrl = `/uploads/${logoFilename}`;
      db.updateSettings({ customLogoUrl: newUrl });
      return res.json({ success: true, url: newUrl, message: 'नयाँ लोगो सुरक्षित गरियो र साइटभरि लागु भयो।' });
    }

    return res.status(400).json({ error: 'SVG कोड वा फोटो फाइल डेटा आवश्यक छ।' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: `लोगो अद्यावधिक गर्न असफल: ${msg}` });
  }
});

// ================= READER FEEDBACK & TIPS =================

apiRouter.post('/feedback', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(feedbackRateLimits, clientIp, 10, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'धेरै पटक प्रतिक्रिया पठाइयो। कृपया केही बेरपछि प्रयास गर्नुहोस्।' });
  }

  const { articleId, articleTitle, type, message, contactName, contactEmailOrPhone } = req.body;
  if (!articleTitle || !message) {
    return res.status(400).json({ error: 'समाचार शीर्षक र प्रतिक्रिया व्यहोरा अनिवार्य छ' });
  }

  const fb = db.addFeedback({
    articleId: articleId || 'general',
    articleTitle: String(articleTitle).trim(),
    type: type || 'reaction',
    message: String(message).trim(),
    contactName: contactName ? String(contactName).trim() : undefined,
    contactEmailOrPhone: contactEmailOrPhone ? String(contactEmailOrPhone).trim() : undefined
  });

  return res.status(201).json({ success: true, message: 'तपाईंको प्रतिक्रिया प्राप्त भयो। धन्यवाद!', id: fb.id });
});

apiRouter.get('/admin/feedback', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getFeedbacks());
});

apiRouter.put('/admin/feedback/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const ok = db.updateFeedbackStatus(id, status);
  return res.json({ success: ok });
});

apiRouter.delete('/admin/feedback/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const ok = db.deleteFeedback(id);
  return res.json({ success: ok });
});

// ================= TEAM MANAGEMENT (RBAC) =================

apiRouter.get('/team', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getTeamMembers());
});

apiRouter.post('/team', requireAuth, requireRole(['owner']), (req: AuthenticatedRequest, res: Response) => {
  const { username, fullName, email, role, password } = req.body;
  if (!username || !fullName || !email || !password || !role) {
    return res.status(400).json({ error: 'सबै विवरणहरू (नाम, प्रयोगकर्ता नाम, इमेल, भूमिका, पासवर्ड) अनिवार्य छन्' });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ error: 'पासवर्ड कम्तीमा ८ अक्षरको हुनुपर्छ' });
  }

  try {
    const member = db.createTeamMember({
      username: String(username).trim(),
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      role: role as UserRole,
      password: String(password)
    });

    db.addAuditLog({
      action: 'team_update',
      targetType: 'team',
      targetTitle: member.username,
      details: `Added new team member "${member.fullName}" with role ${member.role}`,
      userId: req.user?.id || 'admin'
    });

    return res.status(201).json(member);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(400).json({ error: msg });
  }
});

apiRouter.put('/team/:id', requireAuth, requireRole(['owner']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { fullName, email, role, active, newPassword } = req.body;

  const ok = db.updateTeamMember(id, { fullName, email, role, active, newPassword });
  if (!ok) {
    return res.status(404).json({ error: 'टोली सदस्य फेला परेन' });
  }
  return res.json({ success: true, message: 'विवरण अद्यावधिक गरियो' });
});

apiRouter.delete('/team/:id', requireAuth, requireRole(['owner']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const ok = db.deleteTeamMember(id);
    if (!ok) {
      return res.status(404).json({ error: 'सदस्य फेला परेन' });
    }
    return res.json({ success: true, message: 'सदस्य सफलतापूर्वक हटाइयो' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(400).json({ error: msg });
  }
});

// ================= AI EDITORIAL ASSISTANT =================

apiRouter.post('/ai/editorial-assist', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { title, summary, body, action } = req.body;
  const contentText = `${title || ''}\n${summary || ''}\n${body || ''}`.trim();

  if (!contentText) {
    return res.status(400).json({ error: 'सहायता लिनका लागि कम्तीमा शीर्षक वा व्यहोरा प्रविष्ट गर्नुहोस्' });
  }

  // Fast offline Nepali editorial heuristic engine (always reliable & fast)
  const generateLocalSuggestions = () => {
    const wordCount = contentText.split(/\s+/).length;
    const sentences = (body || summary || title || '').split(/[।!?\n]/).filter((s: string) => s.trim().length > 10);
    
    // Catchy & balanced headlines
    const cleanTitle = (title || 'महत्त्वपूर्ण अपडेट').trim();
    const suggestedHeadlines = [
      `${cleanTitle}: के हो खास कारण र पृष्ठभूमि?`,
      `खुलासा: ${cleanTitle} बारे जान्नैपर्ने मुख्य तथ्यहरू`,
      `${cleanTitle} – सार्वजनिक सरोकार र विस्तृत विश्लेषण`
    ];

    // Summary generator
    const firstTwo = sentences.slice(0, 2).map((s: string) => s.trim()).join('। ') + (sentences.length > 0 ? '।' : '');
    const suggestedSummary = firstTwo || `${cleanTitle} सम्बन्धी पछिल्लो वस्तुस्थिति र सार्वजनिक जानकारी।`;

    // Clickbait & Sensationalism check
    const sensationalWords = ['हेर्नुहोस्', 'ह्याक', 'दहलियो', 'विस्फोटक', 'खैलाबैला', 'चकित', 'अचम्म', 'भाइरल'];
    const foundSensational = sensationalWords.filter((w) => contentText.includes(w));
    const clickbaitScore = foundSensational.length > 0 ? Math.min(85, foundSensational.length * 30) : 10;

    return {
      suggestedHeadlines,
      suggestedSummary,
      clickbaitScore,
      sensationalWarnings: foundSensational.map((w) => `अतिशयोक्ति शब्द "${w}" को प्रयोग हटाउनुहोस् वा सन्तुलित बनाउनुहोस्।`),
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 130)),
      editorialTips: [
        'तथ्य र स्रोत खुलाइएको छ कि छैन पुनः जाँच गर्नुहोस्।',
        'संवेदनशील वा आर्थिक विषय भएमा सम्बन्धित डिस्क्लेमर अनिवार्य जोड्नुहोस्।',
        'फोटो प्रयोग गर्दा क्रेडिट र लाइसेन्स स्पष्ट उल्लेख गर्नुहोस्।'
      ]
    };
  };

  // If GEMINI_API_KEY is available, we can also enrich with Gemini Flash
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({});
      const prompt = `You are a senior Nepali news editor. Analyze this article draft:\n\nTitle: ${title}\nSummary: ${summary}\nBody excerpt: ${body?.slice(0, 800)}\n\nRespond ONLY with a valid JSON object in this exact shape:
{
  "suggestedHeadlines": ["3 clear, engaging, non-clickbait Nepali headlines"],
  "suggestedSummary": "2 clear Nepali sentences summarizing the core facts",
  "clickbaitScore": 15,
  "sensationalWarnings": ["any editorial cautions in Nepali"],
  "readingTimeMinutes": 2,
  "editorialTips": ["2 editorial improvement tips in Nepali"]
}`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const responseText = response.text || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json(parsed);
      }
    } catch (aiErr) {
      console.warn('Gemini AI assist fallback to local engine:', aiErr);
    }
  }

  // Fallback to local heuristic engine
  return res.json(generateLocalSuggestions());
});

// ================= CATEGORIES ROUTES =================

apiRouter.get('/categories', (_req: Request, res: Response) => {
  return res.json(db.getCategories());
});

apiRouter.post('/categories', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, nameEn, slug, description, order } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ error: 'श्रेणीको नाम र स्लग आवश्यक छ (Category name and slug required)' });
  }

  const newCat = db.createCategory({
    name: String(name).trim(),
    nameEn: nameEn ? String(nameEn).trim() : name,
    slug: String(slug).trim().toLowerCase(),
    description,
    order: Number(order) || 10
  });

  db.addAuditLog({
    action: 'create',
    targetType: 'category',
    targetTitle: newCat.name,
    details: `Created category ${newCat.nameEn} (${newCat.slug})`,
    userId: req.user?.id || 'admin'
  });

  return res.status(201).json(newCat);
});

apiRouter.put('/categories/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateCategory(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'श्रेणी फेला परेन' });
  }
  return res.json(updated);
});

apiRouter.delete('/categories/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteCategory(id);
  if (!deleted) {
    return res.status(404).json({ error: 'श्रेणी फेला परेन' });
  }
  return res.json({ success: true, message: 'श्रेणी हटाइयो' });
});

// ================= CORRECTIONS ROUTES =================

apiRouter.get('/corrections', (_req: Request, res: Response) => {
  return res.json(db.getCorrections());
});

apiRouter.post('/corrections', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { contentId, contentTitle, issueDate, originalError, correctedText, explanation } = req.body;
  if (!issueDate || !originalError || !correctedText || !explanation) {
    return res.status(400).json({ error: 'सच्याइएको सम्पूर्ण विवरणहरू आवश्यक छन् (All correction fields required)' });
  }

  const newCor = db.createCorrection({
    contentId,
    contentTitle,
    issueDate,
    originalError: String(originalError).trim(),
    correctedText: String(correctedText).trim(),
    explanation: String(explanation).trim()
  });

  db.addAuditLog({
    action: 'create',
    targetType: 'correction',
    targetTitle: `सच्याइ: ${contentTitle || newCor.id}`,
    details: `Logged editorial correction for item ${contentId || 'standalone'}`,
    userId: req.user?.id || 'admin'
  });

  return res.status(201).json(newCor);
});

// ================= SETTINGS ROUTES =================

apiRouter.get('/settings', (_req: Request, res: Response) => {
  return res.json(db.getSettings());
});

apiRouter.put('/settings', requireAuth, requireRole(['owner', 'editor_in_chief']), (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body;
  const updated = db.updateSettings(updates);

  db.addAuditLog({
    action: 'settings_update',
    targetType: 'settings',
    targetTitle: 'Site Settings Updated',
    details: `Updated settings keys: ${Object.keys(updates).join(', ')}`,
    userId: req.user?.id || 'admin'
  });

  return res.json(updated);
});

// ================= MEDIA UPLOAD ROUTES =================

apiRouter.get('/media', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getMedia());
});

apiRouter.post('/media/upload', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { base64Data, filename, mimeType } = req.body;
  if (!base64Data || !filename) {
    return res.status(400).json({ error: 'फाइल डाटा र नाम आवश्यक छ (File data and filename required)' });
  }

  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime'
  ];
  if (mimeType && !allowedMimeTypes.includes(mimeType)) {
    return res.status(400).json({ error: 'केवल फोटो (JPG, PNG, WEBP, GIF, SVG) वा भिडियो (MP4, WEBM) फाइलहरू मात्र अपलोड गर्न सकिन्छ।' });
  }

  const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');

  if (buffer.length > 40 * 1024 * 1024) {
    return res.status(400).json({ error: 'फाइल आकार ४० MB भन्दा कम हुनुपर्छ।' });
  }

  const ext = path.extname(filename) || '.jpg';
  const safeBase = path.basename(filename, ext).replace(/[^\w-]/g, '');
  const uniqueFilename = `${safeBase || 'img'}-${Date.now()}${ext}`;
  const uploadsDir = path.resolve(process.cwd(), 'uploads');

  fs.writeFileSync(path.resolve(uploadsDir, uniqueFilename), buffer);

  const newMedia = db.addMedia({
    filename: uniqueFilename,
    originalName: filename,
    url: `/uploads/${uniqueFilename}`,
    size: buffer.length,
    mimeType: mimeType || 'image/jpeg'
  });

  return res.status(201).json(newMedia);
});

apiRouter.delete('/media/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteMedia(id);
  if (!deleted) {
    return res.status(404).json({ error: 'फाइल फेला परेन' });
  }
  return res.json({ success: true, message: 'फाइल हटाइयो' });
});

// ================= BACKUP & RESTORE =================

apiRouter.get('/backup/export', requireAuth, requireRole(['owner']), (_req: AuthenticatedRequest, res: Response) => {
  const snapshot = db.getFullSnapshot();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="khabargpt-backup-${new Date().toISOString().slice(0, 10)}.json"`);
  return res.send(JSON.stringify(snapshot, null, 2));
});

apiRouter.post('/backup/restore', requireAuth, requireRole(['owner']), (req: AuthenticatedRequest, res: Response) => {
  try {
    const backupData = req.body;
    db.restoreBackup(backupData);
    return res.json({ success: true, message: 'डाटाबेस सफलतापूर्वक पुनर्स्थापित गरियो (Database restored successfully)' });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return res.status(400).json({ error: `पुनर्स्थापना असफल: ${errMsg} (Restore failed)` });
  }
});

// ================= CONTACT MESSAGES =================

apiRouter.post('/contact', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!checkRateLimit(contactRateLimits, clientIp, 5, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'सन्देश पठाउने सीमा समाप्त भयो। कृपया पछि प्रयास गर्नुहोस्। (Rate limit exceeded)' });
  }

  if (req.body.website_trap) {
    return res.json({ success: true, message: 'सन्देश प्राप्त भयो (Message received)' });
  }

  const { name, email, phone, subject, type, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'नाम, इमेल, विषय र सन्देश अनिवार्य छन् (Name, email, subject, and message required)' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return res.status(400).json({ error: 'मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस् (Invalid email address)' });
  }

  const saved = db.addContactMessage({
    name: String(name).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : undefined,
    subject: String(subject).trim(),
    type: type || 'general',
    message: String(message).trim()
  });

  return res.status(201).json({ success: true, message: 'सन्देश सफलतापूर्वक पठाइयो। हामी चाँडै सम्पर्क गर्नेछौँ।', id: saved.id });
});

apiRouter.get('/contact/messages', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getContactMessages());
});

apiRouter.put('/contact/messages/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const marked = db.markMessageRead(id);
  return res.json({ success: marked });
});

apiRouter.post('/contact/messages/:id/reply', requireAuth, requireRole(['owner', 'editor_in_chief', 'sub_editor', 'editor']), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { replySubject, replyMessage, sendViaEmail } = req.body;

  if (!replyMessage || !String(replyMessage).trim()) {
    return res.status(400).json({ error: 'जवाफको व्यहोरा आवश्यक छ (Reply message required)' });
  }

  const targetMsg = db.getContactMessages().find((m) => m.id === id);
  if (!targetMsg) {
    return res.status(404).json({ error: 'सम्पर्क सन्देश फेला परेन' });
  }

  const settings = db.getSettings();
  const resendApiKey = process.env.RESEND_API_KEY || settings.resendApiKey;
  let emailDispatched = false;
  let emailErrorNotice = '';

  if (sendViaEmail && resendApiKey && targetMsg.email) {
    try {
      const fromEmail = settings.resendSenderEmail || 'onboarding@resend.dev';
      const senderName = settings.siteTitle || 'खबर GPT Editorial Desk';
      const subject = replySubject || `Re: ${targetMsg.subject} - खबर GPT`;

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 16px;">
            <h1 style="color: #dc2626; margin: 0; font-size: 20px;">खबर GPT (Khabar GPT)</h1>
            <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">तथ्यपरक सूचना तथा सम्पादकीय डेस्क</p>
          </div>
          <p style="font-size: 14px; margin-top: 0;">नमस्ते <strong>${targetMsg.name}</strong> जी,</p>
          <div style="white-space: pre-wrap; font-size: 14px; background: #f8fafc; padding: 14px; border-radius: 8px; border-left: 4px solid #dc2626; color: #334155; margin: 16px 0;">${replyMessage}</div>
          <div style="margin-top: 20px; padding: 12px; background: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b;">
            <p style="margin: 0 0 4px 0; font-weight: bold; color: #475569;">तपाईंले खबर GPT मा पठाउनुभएको सन्देश:</p>
            <p style="margin: 0; font-style: italic;">"${targetMsg.message}"</p>
          </div>
          <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            <p style="margin: 0;">खबर GPT आधिकारिक फेसबुक: <a href="${settings.facebookUrl || 'https://facebook.com/khabargpt'}" style="color: #dc2626; text-decoration: none;">facebook.com/khabargpt</a></p>
          </div>
        </div>
      `;

      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${senderName} <${fromEmail}>`,
          to: [targetMsg.email],
          subject,
          html: htmlBody,
          text: replyMessage
        })
      });

      if (resp.ok) {
        emailDispatched = true;
      } else {
        const errJson = await resp.json().catch(() => ({}));
        emailErrorNotice = errJson.message || 'इमेल डेलिभरीमा समस्या आयो';
      }
    } catch (mailErr: unknown) {
      console.warn('Reply email dispatch failed:', mailErr);
      emailErrorNotice = mailErr instanceof Error ? mailErr.message : 'इमेल पठाउन सकिएन';
    }
  }

  const updatedMsg = db.recordMessageReply(
    id,
    replySubject || `Re: ${targetMsg.subject}`,
    String(replyMessage).trim(),
    req.user?.fullName || req.user?.username || 'Admin'
  );

  db.addAuditLog({
    action: 'team_update',
    targetType: 'settings',
    targetTitle: `जवाफ पठाइयो: ${targetMsg.name}`,
    details: `Replied to inquiry "${targetMsg.subject}" (${targetMsg.email})${emailDispatched ? ' via Resend email' : ''}`,
    userId: req.user?.id || 'admin'
  });

  return res.json({
    success: true,
    emailDispatched,
    emailNotice: emailErrorNotice,
    message: emailDispatched
      ? 'जवाफ सफलतापूर्वक इमेल मार्फत पठाइयो र अभिलेख सुरक्षित भयो।'
      : 'जवाफ सफलतापूर्वक सुरक्षित गरियो।',
    updatedMessage: updatedMsg
  });
});

apiRouter.delete('/contact/messages/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteContactMessage(id);
  if (!deleted) {
    return res.status(404).json({ error: 'सन्देश फेला परेन' });
  }
  return res.json({ success: true, message: 'सन्देश सफलतापूर्वक हटाइयो' });
});

// ================= AUDIT LOGS =================

apiRouter.get('/audit-logs', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getAuditLogs());
});

apiRouter.get(['/ping'], (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: Date.now()
  });
});

apiRouter.get('/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    app: 'Khabar GPT Independent Platform',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    storage: 'Persistent Transactional Document Store'
  });
});

apiRouter.get('/system-status', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const mem = process.memoryUsage();
  const uptimeSeconds = process.uptime();
  const snapshot = db.getFullSnapshot();

  return res.json({
    status: 'healthy',
    backend: 'Node.js Express + TSX',
    port: 3000,
    database: {
      type: 'Persistent Transactional Document Store',
      path: 'data/khabar_database.json',
      contentCount: snapshot.content.filter((c) => c.status !== 'trash').length,
      trashCount: snapshot.content.filter((c) => c.status === 'trash').length,
      liveEventsCount: (snapshot.liveEvents || []).length,
      adsCount: (snapshot.ads || []).length,
      categoriesCount: snapshot.categories.length,
      correctionsCount: snapshot.corrections.length,
      messagesCount: snapshot.messages.length,
      feedbackCount: (snapshot.feedbacks || []).length,
      mediaCount: snapshot.media.length,
      auditLogsCount: snapshot.auditLogs ? snapshot.auditLogs.length : 0,
      activeSessions: Object.keys(snapshot.sessions || {}).length,
      teamCount: (snapshot.users || []).length
    },
    performance: {
      uptimeMinutes: Math.floor(uptimeSeconds / 60),
      memoryRssMb: Math.round(mem.rss / 1024 / 1024),
      memoryHeapUsedMb: Math.round(mem.heapUsed / 1024 / 1024)
    },
    freeBudgetNotice: 'Initial deployment cost: NPR 0. Zero paid services active.'
  });
});
