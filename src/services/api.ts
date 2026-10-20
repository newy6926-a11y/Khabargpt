import {
  ContentItem,
  Category,
  CorrectionItem,
  SiteSettings,
  MediaItem,
  ContactMessage,
  AuthUser,
  LiveEvent,
  LiveUpdate,
  AdItem,
  MarketSnapshot,
  ArticleFeedback,
  TeamMember,
  UserRole,
  ArticleReactions
} from '../types';

const TOKEN_KEY = 'khabar_auth_token';
const USER_KEY = 'khabar_auth_user';

export const api = {
  // Auth helpers
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: AuthUser) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  },

  clearAuth() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('localStorage error', e);
    }
  },

  getCurrentUser(): AuthUser | null {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'अनपेक्षित त्रुटि (Network or server error)' }));
      throw new Error(errData.error || `Error ${res.status}`);
    }
    return res.json();
  },

  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'लगइन असफल (Login failed)' }));
      throw new Error(err.error || 'लगइन असफल');
    }
    const data = await res.json();
    this.setAuth(data.token, data.user);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await this.fetchWithAuth('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearAuth();
    }
  },

  async verifyAuth(): Promise<AuthUser | null> {
    if (!this.getToken()) return null;
    try {
      const data = await this.fetchWithAuth('/api/auth/me');
      return data.user;
    } catch {
      this.clearAuth();
      return null;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  // Content
  async getContent(options: {
    includeDrafts?: boolean;
    includeTrash?: boolean;
    category?: string;
    type?: string;
    search?: string;
  } = {}): Promise<ContentItem[]> {
    const params = new URLSearchParams();
    if (options.includeDrafts) params.append('includeDrafts', 'true');
    if (options.includeTrash) params.append('includeTrash', 'true');
    if (options.category && options.category !== 'all') params.append('category', options.category);
    if (options.type && options.type !== 'all') params.append('type', options.type);
    if (options.search) params.append('search', options.search);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/content${qs}`, {
      headers: this.getToken() ? { Authorization: `Bearer ${this.getToken()}` } : {}
    });
    return res.json();
  },

  async getContentItem(slugOrId: string): Promise<ContentItem> {
    const res = await fetch(`/api/content/${slugOrId}`, {
      headers: this.getToken() ? { Authorization: `Bearer ${this.getToken()}` } : {}
    });
    if (!res.ok) throw new Error('सामग्री फेला परेन');
    return res.json();
  },

  async createContent(item: Partial<ContentItem>): Promise<ContentItem> {
    return this.fetchWithAuth('/api/content', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  async updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem> {
    return this.fetchWithAuth(`/api/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async trashContent(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/content/${id}/trash`, {
      method: 'POST'
    });
  },

  async getTrashList(): Promise<ContentItem[]> {
    return this.fetchWithAuth('/api/content/trash');
  },

  async restoreContent(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/content/${id}/restore`, {
      method: 'POST'
    });
  },

  async permanentDeleteContent(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/content/${id}/permanent`, {
      method: 'DELETE'
    });
  },

  async emptyTrash(): Promise<{ success: boolean; count: number; message: string }> {
    return this.fetchWithAuth('/api/content/trash/empty', {
      method: 'POST'
    });
  },

  // Reader Reactions
  async recordReaction(
    articleId: string,
    reaction: 'useful' | 'love' | 'informative' | 'thoughtful' | 'disagree'
  ): Promise<{ success: boolean; reactions: ArticleReactions }> {
    const res = await fetch(`/api/content/${articleId}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction })
    });
    return res.json();
  },

  // Live Events
  async getLiveEvents(all = false): Promise<LiveEvent[]> {
    const qs = all ? '?all=true' : '';
    const res = await fetch(`/api/live-events${qs}`, {
      headers: this.getToken() ? { Authorization: `Bearer ${this.getToken()}` } : {}
    });
    return res.json();
  },

  async getLiveEvent(idOrSlug: string): Promise<LiveEvent> {
    const res = await fetch(`/api/live-events/${idOrSlug}`, {
      headers: this.getToken() ? { Authorization: `Bearer ${this.getToken()}` } : {}
    });
    if (!res.ok) throw new Error('प्रत्यक्ष कभरेज फेला परेन');
    return res.json();
  },

  async createLiveEvent(event: Partial<LiveEvent>): Promise<LiveEvent> {
    return this.fetchWithAuth('/api/live-events', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  },

  async updateLiveEvent(id: string, updates: Partial<LiveEvent>): Promise<LiveEvent> {
    return this.fetchWithAuth(`/api/live-events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteLiveEvent(id: string): Promise<{ success: boolean }> {
    return this.fetchWithAuth(`/api/live-events/${id}`, {
      method: 'DELETE'
    });
  },

  async addLiveUpdate(eventId: string, update: Partial<LiveUpdate>): Promise<LiveUpdate> {
    return this.fetchWithAuth(`/api/live-events/${eventId}/updates`, {
      method: 'POST',
      body: JSON.stringify(update)
    });
  },

  async deleteLiveUpdate(eventId: string, updateId: string): Promise<{ success: boolean }> {
    return this.fetchWithAuth(`/api/live-events/${eventId}/updates/${updateId}`, {
      method: 'DELETE'
    });
  },

  async togglePinUpdate(eventId: string, updateId: string): Promise<{ success: boolean }> {
    return this.fetchWithAuth(`/api/live-events/${eventId}/updates/${updateId}/pin`, {
      method: 'POST'
    });
  },

  // Market & Trend Data
  async getMarketData(): Promise<MarketSnapshot> {
    const res = await fetch(`/api/market?_t=${Date.now()}`);
    return res.json();
  },

  async updateMarketRates(data: Partial<MarketSnapshot>): Promise<MarketSnapshot> {
    return this.fetchWithAuth('/api/admin/market', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async resetMarketRates(): Promise<MarketSnapshot> {
    return this.fetchWithAuth('/api/admin/market/reset', {
      method: 'POST'
    });
  },

  async updateDefaultLogo(payload: { svgContent?: string; base64Image?: string; filename?: string }): Promise<{ success: boolean; url: string; message: string }> {
    return this.fetchWithAuth('/api/admin/logo/update-default', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Ads & Sponsorships
  async getAds(position?: string): Promise<AdItem[]> {
    const qs = position ? `?position=${position}` : '';
    const res = await fetch(`/api/ads${qs}`);
    return res.json();
  },

  async getAdminAds(): Promise<AdItem[]> {
    return this.fetchWithAuth('/api/admin/ads');
  },

  async createAd(ad: Partial<AdItem>): Promise<AdItem> {
    return this.fetchWithAuth('/api/admin/ads', {
      method: 'POST',
      body: JSON.stringify(ad)
    });
  },

  async updateAd(id: string, updates: Partial<AdItem>): Promise<AdItem> {
    return this.fetchWithAuth(`/api/admin/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteAd(id: string): Promise<{ success: boolean }> {
    return this.fetchWithAuth(`/api/admin/ads/${id}`, {
      method: 'DELETE'
    });
  },

  async recordAdImpression(id: string): Promise<void> {
    try {
      fetch(`/api/ads/${id}/impression`, { method: 'POST' }).catch(() => {});
    } catch {}
  },

  async recordAdClick(id: string): Promise<void> {
    try {
      fetch(`/api/ads/${id}/click`, { method: 'POST' }).catch(() => {});
    } catch {}
  },

  // Feedback & Reader Tips
  async submitFeedback(data: {
    articleId?: string;
    articleTitle: string;
    type: 'reaction' | 'correction' | 'tip' | 'general';
    message: string;
    contactName?: string;
    contactEmailOrPhone?: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'प्रतिक्रिया पठाउन असफल' }));
      throw new Error(err.error || 'प्रतिक्रिया पठाउन असफल');
    }
    return res.json();
  },

  async getFeedbacks(): Promise<ArticleFeedback[]> {
    return this.fetchWithAuth('/api/admin/feedback');
  },

  async updateFeedbackStatus(id: string, status: 'new' | 'reviewed' | 'resolved'): Promise<{ success: boolean }> {
    return this.fetchWithAuth(`/api/admin/feedback/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async deleteFeedback(id: string): Promise<{ success: boolean }> {
    return this.fetchWithAuth(`/api/admin/feedback/${id}`, {
      method: 'DELETE'
    });
  },

  // Team & RBAC
  async getTeamMembers(): Promise<TeamMember[]> {
    return this.fetchWithAuth('/api/team');
  },

  async createTeamMember(member: {
    username: string;
    fullName: string;
    email: string;
    role: UserRole;
    password: string;
  }): Promise<TeamMember> {
    return this.fetchWithAuth('/api/team', {
      method: 'POST',
      body: JSON.stringify(member)
    });
  },

  async updateTeamMember(
    id: string,
    updates: { fullName?: string; email?: string; role?: UserRole; active?: boolean; newPassword?: string }
  ): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteTeamMember(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/team/${id}`, {
      method: 'DELETE'
    });
  },

  // AI Editorial Assistant
  async runAiAssistant(data: {
    action: string;
    text: string;
  }): Promise<{ result: string }> {
    const res = await this.fetchWithAuth('/api/ai/editorial-assist', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res;
  },

  async deleteContent(id: string): Promise<{ success: boolean; message: string }> {
    return this.trashContent(id);
  },

  async getTrashContent(): Promise<ContentItem[]> {
    return this.getTrashList();
  },

  async submitContact(msg: any): Promise<{ success: boolean; message: string }> {
    return this.sendContactMessage(msg);
  },

  async getAiEditorialAssist(data: {
    title: string;
    summary?: string;
    body?: string;
    action?: 'enhance' | 'summarize' | 'check';
  }): Promise<{
    suggestedHeadlines: string[];
    suggestedSummary: string;
    clickbaitScore: number;
    sensationalWarnings: string[];
    readingTimeMinutes: number;
    editorialTips: string[];
  }> {
    return this.fetchWithAuth('/api/ai/editorial-assist', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch('/api/categories');
    return res.json();
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    return this.fetchWithAuth('/api/categories', {
      method: 'POST',
      body: JSON.stringify(cat)
    });
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    return this.fetchWithAuth(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Corrections
  async getCorrections(): Promise<CorrectionItem[]> {
    const res = await fetch('/api/corrections');
    return res.json();
  },

  async createCorrection(correction: Partial<CorrectionItem>): Promise<CorrectionItem> {
    return this.fetchWithAuth('/api/corrections', {
      method: 'POST',
      body: JSON.stringify(correction)
    });
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch('/api/settings');
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    return this.fetchWithAuth('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    return this.fetchWithAuth('/api/media');
  },

  async uploadMedia(fileOrBase64: File | string, filename?: string, mimeType?: string): Promise<MediaItem> {
    if (typeof fileOrBase64 !== 'string') {
      const file = fileOrBase64;
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      return this.fetchWithAuth('/api/media/upload', {
        method: 'POST',
        body: JSON.stringify({ base64Data: base64, filename: file.name, mimeType: file.type })
      });
    }
    return this.fetchWithAuth('/api/media/upload', {
      method: 'POST',
      body: JSON.stringify({ base64Data: fileOrBase64, filename: filename || 'upload.png', mimeType })
    });
  },

  async deleteMedia(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/media/${id}`, {
      method: 'DELETE'
    });
  },

  // Contact
  async sendContactMessage(msg: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    type?: string;
    message: string;
    website_trap?: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'सन्देश पठाउन असफल' }));
      throw new Error(err.error || 'सन्देश पठाउन असफल');
    }
    return res.json();
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    return this.fetchWithAuth('/api/contact/messages');
  },

  async markMessageRead(id: string): Promise<{ success: boolean }> {
    return this.fetchWithAuth(`/api/contact/messages/${id}/read`, {
      method: 'PUT'
    });
  },

  async deleteContactMessage(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/contact/messages/${id}`, {
      method: 'DELETE'
    });
  },

  // Audit Logs & Diagnostics
  async getAuditLogs(): Promise<any[]> {
    return this.fetchWithAuth('/api/audit-logs');
  },

  async getSystemStatus(): Promise<any> {
    return this.fetchWithAuth('/api/system-status');
  },

  // Backup / Restore
  async restoreBackup(backupData: any): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth('/api/backup/restore', {
      method: 'POST',
      body: JSON.stringify(backupData)
    });
  },

  // Newsletter Subscribers & Gmail Dispatch
  async subscribeNewsletter(email: string, frequency: 'daily' | 'weekly' = 'daily'): Promise<{ success: boolean; message: string; subscriber: any }> {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, frequency })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'सदस्यता लिन असफल भयो' }));
      throw new Error(err.error || 'सदस्यता लिन असफल भयो');
    }
    return res.json();
  },

  async getNewsletterSubscribers(): Promise<any[]> {
    return this.fetchWithAuth('/api/admin/newsletter/subscribers');
  },

  async addNewsletterSubscriber(email: string, frequency: 'daily' | 'weekly' = 'daily'): Promise<any> {
    return this.fetchWithAuth('/api/admin/newsletter/subscribers', {
      method: 'POST',
      body: JSON.stringify({ email, frequency })
    });
  },

  async toggleNewsletterSubscriber(id: string): Promise<any> {
    return this.fetchWithAuth(`/api/admin/newsletter/subscribers/${id}/toggle`, {
      method: 'PUT'
    });
  },

  async deleteNewsletterSubscriber(id: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/api/admin/newsletter/subscribers/${id}`, {
      method: 'DELETE'
    });
  },

  async dispatchNewsletter(data: { subject: string; digestText: string; digestHtml?: string }): Promise<{
    success: boolean;
    sentCount: number;
    senderEmail: string;
    senderName: string;
    message: string;
  }> {
    return this.fetchWithAuth('/api/admin/newsletter/dispatch', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
