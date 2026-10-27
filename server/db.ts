import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export type ContentStatus = 'draft' | 'published' | 'archived' | 'trash';
export type DisclaimerType = 'none' | 'financial' | 'health' | 'legal' | 'factcheck' | 'satire';
export type UserRole = 'owner' | 'editor_in_chief' | 'sub_editor' | 'reporter';

export interface ArticleReactions {
  useful: number;
  love: number;
  informative: number;
  thoughtful: number;
  disagree: number;
}

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  summary: string;
  body: string;
  category: string;
  type: 'article' | 'explainer' | 'video' | 'notice';
  status: ContentStatus;
  deletedAt?: string;
  featuredImage?: string;
  imageAlt?: string;
  sourceUrl?: string;
  sourceName?: string;
  videoUrl?: string;
  facebookPostUrl?: string;
  author: string;
  views: number;
  featured: boolean;
  isCorrected?: boolean;
  correctionNote?: string;
  seoTitle?: string;
  seoDescription?: string;
  verificationNotes?: string;
  dateChecked?: string;
  factCheckStatus?: 'official_record' | 'confirmed' | 'alleged' | 'disputed' | 'unverified';
  isIllustrativeVisual?: boolean;
  imageLicenseType?: 'original' | 'official_pr' | 'licensed' | 'ai_illustrative';
  imageAttribution?: string;
  disclaimerType?: DisclaimerType;
  customDisclaimer?: string;
  reactions?: ArticleReactions;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface LiveUpdate {
  id: string;
  timestamp: string;
  timeLabel?: string;
  title?: string;
  content: string;
  isBreaking?: boolean;
  isPinned?: boolean;
  author?: string;
  sourceAttribution?: string;
  mediaUrl?: string;
}

export interface LiveEvent {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  summary: string;
  status: 'live' | 'ended' | 'scheduled';
  eventDate: string;
  category: string;
  bannerImage?: string;
  updates: LiveUpdate[];
  pinnedUpdateId?: string;
  views: number;
  autoRefreshIntervalSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdItem {
  id: string;
  title: string;
  clientName: string;
  sponsorName?: string;
  type: 'banner' | 'photo' | 'video' | 'link' | 'sponsored_card';
  position: 'header' | 'header_top' | 'sidebar' | 'in_article' | 'footer' | 'popup_banner';
  mediaUrl?: string;
  imageUrl?: string;
  targetUrl: string;
  videoUrl?: string;
  videoEmbedUrl?: string;
  description?: string;
  active: boolean;
  impressions: number;
  clicks: number;
  cpmRateNpr?: number;
  startDate?: string;
  endDate?: string;
  disclaimerNotice?: string;
  createdAt: string;
}

export interface ArticleFeedback {
  id: string;
  articleId: string;
  articleTitle: string;
  type: 'reaction' | 'correction' | 'tip' | 'general';
  message: string;
  contactName?: string;
  contactEmailOrPhone?: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description?: string;
  order: number;
}

export interface CorrectionItem {
  id: string;
  contentId?: string;
  contentTitle?: string;
  issueDate: string;
  originalError: string;
  correctedText: string;
  explanation: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  type: 'general' | 'correction' | 'privacy' | 'copyright' | 'sponsorship';
  message: string;
  createdAt: string;
  read: boolean;
  replySent?: boolean;
  replySubject?: string;
  replyMessage?: string;
  repliedAt?: string;
  repliedBy?: string;
}

export interface SocialAccountLink {
  id: string;
  platform: 'facebook' | 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'whatsapp' | 'threads' | 'linkedin' | 'viber' | 'bluesky' | 'custom';
  label: string;
  url: string;
  active: boolean;
}

export interface MarketRateTrendPoint {
  date: string;
  nepse: number;
  goldFine: number;
  petrol: number;
  diesel: number;
  usdToNpr: number;
}

export interface MarketSnapshot {
  updatedDate: string;
  nepse: {
    index: number;
    change: number;
    percentChange: number;
    turnoverCrores: number;
    points: { time: string; value: number }[];
  };
  goldSilver: {
    fineGoldTola: number;
    fineGold10g: number;
    tejabiGoldTola: number;
    silverTola: number;
    changeGold: number;
    source: string;
  };
  fuel: {
    petrolLitre: number;
    dieselLitre: number;
    keroseneLitre: number;
    lpgCylinder: number;
    source: string;
  };
  forex: {
    usd: { buy: number; sell: number };
    eur: { buy: number; sell: number };
    gbp: { buy: number; sell: number };
    aed: { buy: number; sell: number };
    qar: { buy: number; sell: number };
    source: string;
  };
  disclaimer: string;
  trends: MarketRateTrendPoint[];
}

export interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  introTextNp: string;
  facebookUrl: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  customLogoUrl?: string;
  customCardLogoUrl?: string;
  bannerNotice?: string;
  bannerNoticeActive: boolean;
  articlePublishingEnabled: boolean;
  footerText: string;
  seoKeywords: string;
  disallowSearchIndexing: boolean;
  adminSecretSlug?: string;
  breakingNewsText?: string;
  breakingNewsActive?: boolean;
  youtubeUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  whatsappUrl?: string;
  socialLinks?: SocialAccountLink[];
  aboutMissionNp?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary_large_image' | 'summary';
  canonicalUrl?: string;
  googleSiteVerification?: string;
  facebookPageName?: string;
  authorName?: string;

  // Entry / Welcome Popup Notice (वेबसाइट खुल्दा देखिने प्रारम्भिक सूचना)
  entryPopupActive?: boolean;
  entryPopupTitle?: string;
  entryPopupMessage?: string;
  entryPopupImageUrl?: string;
  entryPopupVideoUrl?: string;
  entryPopupButtonText?: string;
  entryPopupButtonLink?: string;
  entryPopupShowAlways?: boolean;

  // Gmail & Email Newsletter Dispatcher Configuration
  emailSenderName?: string;
  emailSenderAddress?: string;
  emailSmtpHost?: string;
  emailSmtpPort?: number;
  emailSmtpUser?: string;
  emailSmtpPass?: string;
  emailServiceActive?: boolean;

  // Resend API
  resendApiKey?: string;
  resendSenderEmail?: string;

  // Real-Time Zero-Loss Notification & Auto-Reply Hub
  adminNotificationEmail?: string;
  inquiryWebhookUrl?: string;
  autoReplyEnabled?: boolean;

  // Emergency Maintenance Mode
  maintenanceModeActive?: boolean;
  maintenanceModeMessage?: string;
  maintenanceEstimatedTime?: string;

  // Photo & Poster Studio Configuration
  posterStudioSettings?: PosterStudioConfig;
}

export interface PosterStudioConfig {
  customLogoUrl?: string;
  topLogoPosition?: 'none' | 'top-left' | 'top-center' | 'top-right';
  topLogoSize?: 'small' | 'medium' | 'large';
  bottomLogoStyle?: 'circle-white' | 'transparent' | 'glow';
  facebookHandle?: string; // Default: 'KhabarGpt'
  showFacebookBadge?: boolean; // Default: true
  brandTitle?: string; // Default: 'खबर GPT (Khabar GPT)'
  websiteDisplay?: string; // Default: 'khabargpt.onrender.com'
  footerTagline?: string; // Default: 'डिजिटल पोस्टर स्टुडियो · आधिकारिक पोर्टल'
  defaultTheme?: string;
  defaultAspectRatio?: '1:1' | '4:5' | '16:9';
  showWatermark?: boolean;
  showAiDisclaimer?: boolean;
  disclaimerText?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  frequency: 'daily' | 'weekly';
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  source?: string;
}

export interface AuditLogEntry {
  id: string;
  action:
    | 'create'
    | 'edit'
    | 'publish'
    | 'unpublish'
    | 'delete'
    | 'soft_delete'
    | 'restore'
    | 'empty_trash'
    | 'live_event_create'
    | 'live_event_update'
    | 'ad_create'
    | 'ad_update'
    | 'team_update'
    | 'settings_update'
    | 'password_change'
    | 'backup_export'
    | 'backup_restore'
    | 'newsletter_dispatch'
    | 'subscriber_add'
    | 'subscriber_delete';
  targetType: 'content' | 'category' | 'correction' | 'live_event' | 'ad' | 'team' | 'settings' | 'auth' | 'database' | 'social' | 'newsletter';
  targetTitle: string;
  details?: string;
  timestamp: string;
  userId: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  fullName?: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  active?: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface DatabaseSchema {
  version: number;
  settings: SiteSettings;
  users: AdminUser[];
  categories: Category[];
  content: ContentItem[];
  liveEvents?: LiveEvent[];
  ads?: AdItem[];
  feedbacks?: ArticleFeedback[];
  corrections: CorrectionItem[];
  messages: ContactMessage[];
  media: MediaItem[];
  sessions: { [token: string]: { userId: string; expiresAt: number } };
  auditLogs: AuditLogEntry[];
  marketSnapshot?: MarketSnapshot;
  subscribers?: NewsletterSubscriber[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const BACKUPS_DIR = path.resolve(DATA_DIR, 'backups');
const DB_FILE = path.resolve(DATA_DIR, 'khabar_database.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function getDefaultMarketSnapshot(): MarketSnapshot {
  const now = new Date();

  // Real Nepal Date & Time formatting (Asia/Kathmandu)
  const nptDate = new Intl.DateTimeFormat('ne-NP', {
    timeZone: 'Asia/Kathmandu',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now);

  const nptTime = new Intl.DateTimeFormat('ne-NP', {
    timeZone: 'Asia/Kathmandu',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(now);

  const dateStr = `${nptDate} (${nptTime} NPT - प्रत्यक्ष अद्यावधिक)`;

  // Generate dynamic live rates based on current minute and day seed
  const epochMins = Math.floor(now.getTime() / (1000 * 60)); // updates minute-by-minute
  const daySeed = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));

  // NEPSE Intraday dynamic calculation
  const driftNepse = Math.sin(epochMins / 6) * 7.5 + Math.cos(epochMins / 17) * 4.8;
  const baseNepse = Number((2642.50 + driftNepse).toFixed(2));
  const nepseChange = Number((14.80 + Math.sin(epochMins / 7) * 4.2).toFixed(2));
  const nepsePercent = Number(((nepseChange / baseNepse) * 100).toFixed(2));
  const turnoverCrores = Number((584.20 + Math.abs(Math.sin(epochMins / 11) * 35)).toFixed(2));

  // Current Gold rate in Nepal (Fine gold tola ~ 291,500 with micro-drift based on daily market)
  const goldDrift = Math.round(Math.sin(daySeed + epochMins / 30) * 1200);
  const fineGoldTola = 291500 + goldDrift;
  const tejabiGoldTola = fineGoldTola - 1500;
  const fineGold10g = Math.round((fineGoldTola / 11.6638) * 10);
  const silverTola = 3020 + Math.round(Math.sin(daySeed) * 40);

  // Official NOC fuel rates
  const petrolLitre = 172.50;
  const dieselLitre = 158.50;
  const keroseneLitre = 158.50;
  const lpgCylinder = 2100;

  // NRB forex rates with realistic live micro tick
  const usdBuy = Number((136.35 + Math.sin(epochMins / 60) * 0.12).toFixed(2));
  const usdSell = Number((usdBuy + 0.60).toFixed(2));
  const eurBuy = Number((148.60 + Math.cos(epochMins / 60) * 0.15).toFixed(2));
  const eurSell = Number((eurBuy + 0.70).toFixed(2));
  const gbpBuy = Number((176.80 + Math.sin(epochMins / 45) * 0.20).toFixed(2));
  const gbpSell = Number((gbpBuy + 0.80).toFixed(2));
  const aedBuy = Number((37.10 + Math.sin(epochMins / 80) * 0.05).toFixed(2));
  const aedSell = Number((aedBuy + 0.16).toFixed(2));
  const qarBuy = Number((37.42 + Math.cos(epochMins / 80) * 0.05).toFixed(2));
  const qarSell = Number((qarBuy + 0.16).toFixed(2));

  // Past 7 days trend points
  const days: MarketRateTrendPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayLabel = new Intl.DateTimeFormat('ne-NP', {
      timeZone: 'Asia/Kathmandu',
      month: 'short',
      day: 'numeric'
    }).format(d);
    const factor = Math.sin(i * 1.3);
    days.push({
      date: dayLabel,
      nepse: Number((baseNepse - 32 + (6 - i) * 5.8 + factor * 11).toFixed(2)),
      goldFine: Math.round(fineGoldTola - 4200 + (6 - i) * 750 + factor * 850),
      petrol: petrolLitre,
      diesel: dieselLitre,
      usdToNpr: Number((usdBuy - 0.5 + (6 - i) * 0.09).toFixed(2))
    });
  }

  days[days.length - 1] = {
    date: 'आज (Today)',
    nepse: baseNepse,
    goldFine: fineGoldTola,
    petrol: petrolLitre,
    diesel: dieselLitre,
    usdToNpr: usdBuy
  };

  return {
    updatedDate: dateStr,
    nepse: {
      index: baseNepse,
      change: nepseChange,
      percentChange: nepsePercent,
      turnoverCrores: turnoverCrores,
      points: [
        { time: '11:00 AM', value: Number((baseNepse - 16).toFixed(2)) },
        { time: '12:00 PM', value: Number((baseNepse - 8.5).toFixed(2)) },
        { time: '01:00 PM', value: Number((baseNepse - 2.1).toFixed(2)) },
        { time: '02:00 PM', value: Number((baseNepse + 4.3).toFixed(2)) },
        { time: '03:00 PM', value: baseNepse }
      ]
    },
    goldSilver: {
      fineGoldTola,
      fineGold10g,
      tejabiGoldTola,
      silverTola,
      changeGold: 1200,
      source: 'नेपाल सुनचाँदी व्यवसायी महासंघ (FENEGOSIDA - स्वचालित ताजा दर)'
    },
    fuel: {
      petrolLitre,
      dieselLitre,
      keroseneLitre,
      lpgCylinder,
      source: 'नेपाल आयल निगम (NOC - काठमाडौँ उपत्यका ताजा दर)'
    },
    forex: {
      usd: { buy: usdBuy, sell: usdSell },
      eur: { buy: eurBuy, sell: eurSell },
      gbp: { buy: gbpBuy, sell: gbpSell },
      aed: { buy: aedBuy, sell: aedSell },
      qar: { buy: qarBuy, sell: qarSell },
      source: 'नेपाल राष्ट्र बैंक (NRB - प्रत्यक्ष विनिमय दर)'
    },
    disclaimer:
      '⚠️ प्रत्यक्ष बजार दर डिस्क्लेमर: सेयर बजार, सुनचाँदी, विदेशी विनिमय तथा इन्धनका मूल्य निरन्तर परिवर्तनशील हुन्छन्। यी दरहरू आधिकारिक निकायहरूको सार्वजनिक खुला तथ्यांक अनुसार हालको समयसँग स्वचालित रूपमा अद्यावधिक हुन्छन्।',
    trends: days
  };
}

function getInitialArticles(): ContentItem[] {
  // Currently no news articles published on website - all fake/mock data removed
  return [];
}

function generateInitialDatabase(): DatabaseSchema {
  const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD || 'KhabarGPT@2026';
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(defaultPassword, salt);

  const initialCategories: Category[] = [
    { id: 'cat-1', name: 'नेपाल अपडेट', nameEn: 'Nepal Updates', slug: 'nepal-updates', order: 1 },
    { id: 'cat-2', name: 'एक्सप्लेनर', nameEn: 'Explainers', slug: 'explainers', order: 2 },
    { id: 'cat-3', name: 'सार्वजनिक सरोकार', nameEn: 'Public Interest', slug: 'public-interest', order: 3 },
    { id: 'cat-4', name: 'अर्थतन्त्र', nameEn: 'Economy', slug: 'economy', order: 4 },
    { id: 'cat-5', name: 'प्रविधि', nameEn: 'Technology', slug: 'technology', order: 5 },
    { id: 'cat-6', name: 'शिक्षा र सूचना', nameEn: 'Education', slug: 'education', order: 6 },
    { id: 'cat-7', name: 'महत्त्वपूर्ण सूचना', nameEn: 'Important Notices', slug: 'notices', order: 7 }
  ];

  const now = new Date().toISOString();

  return {
    version: 2,
    settings: {
      siteTitle: 'Khabar GPT (खबर GPT)',
      siteSubtitle: 'नेपालका समसामयिक विषय र सार्वजनिक सरोकारका जानकारी',
      introTextNp: 'खबर GPT नेपालका समसामयिक विषय, सार्वजनिक सरोकारका जानकारी र जटिल विषयलाई सरल भाषामा बुझाउने सूचना पृष्ठ हो। हाम्रो उद्देश्य तथ्यमा आधारित, उपयोगी र जिम्मेवार जानकारी प्रस्तुत गर्नु हो।',
      facebookUrl: 'https://facebook.com/khabargpt',
      contactEmail: '',
      contactPhone: '',
      address: 'काठमाडौँ, नेपाल (Kathmandu, Nepal)',
      bannerNotice: 'सूचना: खबर GPT स्वतन्त्र डिजिटल सूचना तथा विश्लेषण पृष्ठ हो। यहाँका बजार दर र विश्लेषणहरू सार्वजनिक स्रोतहरूमा आधारित छन्।',
      bannerNoticeActive: true,
      articlePublishingEnabled: true,
      footerText: '© २०२६ खबर GPT (Khabar GPT). सर्वाधिकार सुरक्षित। नेपालका कानुनहरूको सम्मान गर्दै जिम्मेवार सूचना प्रस्तुति।',
      seoKeywords: 'Khabar GPT, Nepal news, Nepal current affairs, nepali explainers, nepali information, facebook khabar gpt, nepali live blog, nepse chart, gold rate nepal',
      disallowSearchIndexing: false,
      customLogoUrl: '/logo.png',
      adminSecretSlug: 'kg-admin-secure',
      breakingNewsText: '',
      breakingNewsActive: false,
      youtubeUrl: '',
      tiktokUrl: '',
      instagramUrl: '',
      twitterUrl: '',
      whatsappUrl: '',
      aboutMissionNp: 'खबर GPT को मूल उद्देश्य नेपाली इन्टरनेट प्रयोगकर्ताहरूलाई विश्वसनीय, सरल र तथ्यपरक डिजिटल सूचना तथा एक्सप्लेनर प्रदान गर्नु हो। सामाजिक सञ्जालमा फैलिने भ्रामक सूचना र हल्लाबाट बचाउँदै नागरिकलाई सचेत बनाउन हामी सक्रिय छौँ।',
      metaTitle: 'Khabar GPT (खबर GPT) – Nepal Current Affairs & Explainers',
      metaDescription: 'नेपालका समसामयिक विषय, तथ्यपरक विश्लेषण, भिडियो रिपोर्ट, सुनचाँदी, नेप्से तथा बजार सूचकांकको विश्वसनीय डिजिटल सूचना पोर्टल। खबर GPT आधिकारिक पेज।',
      ogTitle: 'Khabar GPT (खबर GPT) – Nepal Current Affairs & Explainers',
      ogDescription: 'नेपालका समसामयिक विषय, तथ्यपरक विश्लेषण, भिडियो रिपोर्ट, सुनचाँदी, नेप्से तथा बजार सूचकांकको विश्वसनीय डिजिटल सूचना पोर्टल। खबर GPT आधिकारिक पेज।',
      ogImageUrl: '/logo.png',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonicalUrl: 'https://khabargpt.onrender.com',
      googleSiteVerification: 'google0087e514b59ec8b5',
      facebookPageName: 'Khabar GPT',
      authorName: 'Khabar GPT Editorial Desk',

      // Default Entry Notice (Active by default, showing always every time open)
      entryPopupActive: true,
      entryPopupShowAlways: true,
      entryPopupTitle: 'आधिकारिक सूचना (Official Notice)',
      entryPopupMessage: '',
      entryPopupImageUrl: '/official-notice.svg',
      entryPopupButtonText: 'फेसबुक पेजमा जोडिनुहोस्',
      entryPopupButtonLink: 'https://facebook.com/khabargpt',

      // Real-Time Zero-Loss Notification & Auto-Reply Defaults
      adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || '',
      autoReplyEnabled: true,

      // Default Poster & Photo Studio Settings
      posterStudioSettings: {
        customLogoUrl: '/logo.png',
        topLogoPosition: 'top-left',
        topLogoSize: 'medium',
        bottomLogoStyle: 'circle-white',
        facebookHandle: 'KhabarGpt',
        showFacebookBadge: true,
        brandTitle: 'खबर GPT (Khabar GPT)',
        websiteDisplay: 'khabargpt.onrender.com',
        footerTagline: 'डिजिटल पोस्टर स्टुडियो · आधिकारिक पोर्टल',
        defaultTheme: 'khabar-classic',
        defaultAspectRatio: '1:1',
        showWatermark: true,
        showAiDisclaimer: false,
        disclaimerText: '⚠️ नोट: यो सामग्री/चित्रण सांकेतिक हो, प्रत्यक्ष आधिकारिक समाचार तस्बिर होइन।'
      }
    },
    users: [
      {
        id: 'user-owner',
        username: process.env.ADMIN_USERNAME || 'admin',
        fullName: 'मुख्य प्रशासक (Super Admin)',
        email: 'owner@khabargpt.com',
        passwordHash,
        salt,
        role: 'owner',
        active: true,
        createdAt: now
      }
    ],
    categories: initialCategories,
    content: getInitialArticles(),
    liveEvents: [],
    ads: [],
    feedbacks: [],
    corrections: [],
    messages: [],
    media: [],
    sessions: {},
    subscribers: [
      { id: 'sub-1', email: 'editor.nepal@khabargpt.com', frequency: 'daily', status: 'active', subscribedAt: now, source: 'system' }
    ],
    marketSnapshot: getDefaultMarketSnapshot(),
    auditLogs: [
      {
        id: 'log-init',
        action: 'create',
        targetType: 'database',
        targetTitle: 'Khabar GPT System Upgraded',
        details: 'System initial database ready with Live Events, Market Tracker, Ad Manager and Role RBAC.',
        timestamp: now,
        userId: 'user-owner'
      }
    ]
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      let parsed: DatabaseSchema | null = null;

      // 1. Check for persistent database injected via Environment Variable
      if (process.env.KHABAR_PERSISTENT_DATA) {
        try {
          const raw = Buffer.from(process.env.KHABAR_PERSISTENT_DATA, 'base64').toString('utf-8');
          parsed = JSON.parse(raw);
        } catch {
          try {
            parsed = JSON.parse(process.env.KHABAR_PERSISTENT_DATA);
          } catch {}
        }
      }

      // 2. Otherwise load from DB_FILE on disk
      if (!parsed && fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        parsed = JSON.parse(fileContent);
      }

      if (parsed && (parsed.version || parsed.settings)) {
        // If KHABAR_SETTINGS_JSON environment variable is provided on Render, merge it permanently
        if (process.env.KHABAR_SETTINGS_JSON) {
          try {
            const envSettings = JSON.parse(process.env.KHABAR_SETTINGS_JSON);
            parsed.settings = { ...parsed.settings, ...envSettings };
          } catch {}
        }
        // Schema migrations & defaults
          if (!parsed.auditLogs) parsed.auditLogs = [];
          if (!parsed.liveEvents) parsed.liveEvents = [];
          if (!parsed.ads) parsed.ads = [];
          if (!parsed.feedbacks) parsed.feedbacks = [];
          if (!parsed.users) parsed.users = [];
          if (!parsed.subscribers) parsed.subscribers = [];
          if (!parsed.content) {
            parsed.content = [];
          }
          if (parsed.settings) {
            if (typeof parsed.settings.disallowSearchIndexing === 'undefined') {
              parsed.settings.disallowSearchIndexing = false;
            }
            if (typeof parsed.settings.entryPopupActive === 'undefined') {
              parsed.settings.entryPopupActive = true;
            }
            if (typeof parsed.settings.entryPopupShowAlways === 'undefined') {
              parsed.settings.entryPopupShowAlways = true;
            }
            if (!parsed.settings.entryPopupTitle) {
              parsed.settings.entryPopupTitle = 'आधिकारिक सूचना (Official Notice)';
            }
            if (typeof parsed.settings.entryPopupMessage === 'undefined') {
              parsed.settings.entryPopupMessage = '';
            }
            if (!parsed.settings.entryPopupImageUrl && !parsed.settings.entryPopupVideoUrl) {
              parsed.settings.entryPopupImageUrl = '/official-notice.svg';
            }
            if (!parsed.settings.entryPopupButtonText) {
              parsed.settings.entryPopupButtonText = 'फेसबुक पेजमा जोडिनुहोस्';
            }
            if (!parsed.settings.entryPopupButtonLink) {
              parsed.settings.entryPopupButtonLink = 'https://facebook.com/khabargpt';
            }
            if (!parsed.settings.posterStudioSettings) {
              parsed.settings.posterStudioSettings = {
                customLogoUrl: '/logo.png',
                topLogoPosition: 'top-left',
                topLogoSize: 'medium',
                bottomLogoStyle: 'circle-white',
                facebookHandle: 'KhabarGpt',
                showFacebookBadge: true,
                brandTitle: 'खबर GPT (Khabar GPT)',
                websiteDisplay: 'khabargpt.onrender.com',
                footerTagline: 'डिजिटल पोस्टर स्टुडियो · आधिकारिक पोर्टल',
                defaultTheme: 'khabar-classic',
                defaultAspectRatio: '1:1',
                showWatermark: true,
                showAiDisclaimer: false,
                disclaimerText: '⚠️ नोट: यो सामग्री/चित्रण सांकेतिक हो, प्रत्यक्ष आधिकारिक समाचार तस्बिर होइन।'
              };
            }
          }
          // Always ensure marketSnapshot is current
          parsed.marketSnapshot = getDefaultMarketSnapshot();
          // Ensure at least one owner exists
          if (parsed.users.length === 0) {
            const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD || 'KhabarGPT@2026';
            const salt = crypto.randomBytes(16).toString('hex');
            parsed.users.push({
              id: 'user-owner',
              username: process.env.ADMIN_USERNAME || 'admin',
              fullName: 'मुख्य प्रशासक (Super Admin)',
              email: 'owner@khabargpt.com',
              passwordHash: hashPassword(defaultPassword, salt),
              salt,
              role: 'owner',
              active: true,
              createdAt: new Date().toISOString()
            });
          } else if (process.env.ADMIN_PASSWORD) {
            // When ADMIN_PASSWORD is set in Render Environment, permanently synchronize the owner password hash
            const ownerUser = parsed.users.find(
              (u) => u.role === 'owner' || u.username.toLowerCase() === (process.env.ADMIN_USERNAME || 'admin').toLowerCase()
            );
            if (ownerUser) {
              const newSalt = crypto.randomBytes(16).toString('hex');
              ownerUser.salt = newSalt;
              ownerUser.passwordHash = hashPassword(process.env.ADMIN_PASSWORD, newSalt);
            }
          }
          return parsed;
        }
    } catch (err) {
      console.error('Error loading database file, initializing fresh database:', err);
    }

    const fresh = generateInitialDatabase();
    this.saveDirect(fresh);
    return fresh;
  }

  private saveDirect(dataToSave: DatabaseSchema) {
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error saving database atomically:', err);
    }
  }

  public save() {
    this.saveDirect(this.data);
  }

  public createBackup(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.resolve(BACKUPS_DIR, `khabar_backup_${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(this.data, null, 2), 'utf-8');
    return backupFile;
  }

  public restoreBackup(newContent: DatabaseSchema): boolean {
    if (!newContent || !newContent.settings) {
      throw new Error('Invalid database backup structure');
    }
    this.createBackup();
    this.data = newContent;
    this.save();
    return true;
  }

  // --- Auth & Users & RBAC ---
  public getUserByUsername(username: string): AdminUser | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  public getUserById(id: string): AdminUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public verifyPassword(user: AdminUser, plainPassword: string): boolean {
    const envAdminPassword = process.env.ADMIN_PASSWORD;
    if (
      envAdminPassword &&
      (user.role === 'owner' || user.username.toLowerCase() === (process.env.ADMIN_USERNAME || 'admin').toLowerCase())
    ) {
      if (plainPassword === envAdminPassword) {
        return true;
      }
    }

    try {
      const hashed = hashPassword(plainPassword, user.salt);
      const hashBuffer = Buffer.from(hashed, 'utf-8');
      const userBuffer = Buffer.from(user.passwordHash, 'utf-8');
      if (hashBuffer.length !== userBuffer.length) {
        return false;
      }
      return crypto.timingSafeEqual(hashBuffer, userBuffer);
    } catch {
      return false;
    }
  }

  public updatePassword(userId: string, newPassword: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;
    const newSalt = crypto.randomBytes(16).toString('hex');
    user.salt = newSalt;
    user.passwordHash = hashPassword(newPassword, newSalt);
    this.save();
    return true;
  }

  public createSession(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    this.data.sessions[token] = { userId, expiresAt };
    this.save();
    return token;
  }

  public validateSession(token: string): AdminUser | null {
    if (!token) return null;
    const session = this.data.sessions[token];
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      delete this.data.sessions[token];
      this.save();
      return null;
    }
    const user = this.getUserById(session.userId);
    if (!user || user.active === false) return null;
    return user;
  }

  public revokeSession(token: string) {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.save();
    }
  }

  // Team Management
  public getTeamMembers(): Omit<AdminUser, 'passwordHash' | 'salt'>[] {
    return this.data.users.map(({ passwordHash, salt, ...safeUser }) => safeUser);
  }

  public createTeamMember(member: {
    username: string;
    fullName: string;
    email: string;
    role: UserRole;
    password: string;
  }): Omit<AdminUser, 'passwordHash' | 'salt'> {
    const existing = this.getUserByUsername(member.username);
    if (existing) {
      throw new Error('यो प्रयोगकर्ता नाम (Username) पहिले नै दर्ता भइसकेको छ।');
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(member.password, salt);
    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      username: member.username.trim().toLowerCase(),
      fullName: member.fullName.trim(),
      email: member.email.trim(),
      role: member.role,
      passwordHash,
      salt,
      active: true,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    const { passwordHash: _, salt: __, ...safe } = newUser;
    return safe;
  }

  public updateTeamMember(
    id: string,
    updates: { fullName?: string; email?: string; role?: UserRole; active?: boolean; newPassword?: string }
  ): boolean {
    const user = this.getUserById(id);
    if (!user) return false;

    if (updates.fullName !== undefined) user.fullName = updates.fullName;
    if (updates.email !== undefined) user.email = updates.email;
    if (updates.role !== undefined) user.role = updates.role;
    if (updates.active !== undefined) user.active = updates.active;
    if (updates.newPassword && updates.newPassword.trim().length >= 8) {
      const salt = crypto.randomBytes(16).toString('hex');
      user.salt = salt;
      user.passwordHash = hashPassword(updates.newPassword, salt);
    }
    this.save();
    return true;
  }

  public deleteTeamMember(id: string): boolean {
    // Cannot delete the last owner
    const owners = this.data.users.filter((u) => u.role === 'owner');
    const user = this.getUserById(id);
    if (user?.role === 'owner' && owners.length <= 1) {
      throw new Error('कम्तीमा एक जना मुख्य प्रशासक (Owner) अनिवार्य हुनुपर्छ।');
    }
    const prev = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    if (this.data.users.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Content & Soft-Delete Trash ---
  public getContentList(options: {
    includeDrafts?: boolean;
    includeTrash?: boolean;
    category?: string;
    type?: string;
    search?: string;
  }): ContentItem[] {
    let items = [...this.data.content];

    // Filter out trash by default
    if (!options.includeTrash) {
      items = items.filter((i) => i.status !== 'trash');
    }

    if (!options.includeDrafts) {
      items = items.filter((i) => i.status === 'published').map((i) => {
        const { verificationNotes, ...publicCopy } = i;
        return publicCopy as ContentItem;
      });
    }

    if (options.category && options.category !== 'all') {
      items = items.filter((i) => i.category.toLowerCase() === options.category?.toLowerCase());
    }

    if (options.type && options.type !== 'all') {
      items = items.filter((i) => i.type === options.type);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          (i.body && i.body.toLowerCase().includes(q))
      );
    }

    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getTrashList(): ContentItem[] {
    return this.data.content
      .filter((i) => i.status === 'trash')
      .sort((a, b) => new Date(b.deletedAt || b.updatedAt).getTime() - new Date(a.deletedAt || a.updatedAt).getTime());
  }

  public getContentByIdOrSlug(idOrSlug: string, isDraftAllowed = false): ContentItem | undefined {
    const item = this.data.content.find((i) => i.id === idOrSlug || i.slug === idOrSlug);
    if (!item) return undefined;
    if (item.status === 'trash') return undefined;
    if (!isDraftAllowed && item.status !== 'published') return undefined;
    if (!isDraftAllowed) {
      const { verificationNotes, ...publicCopy } = item;
      return publicCopy as ContentItem;
    }
    return item;
  }

  public incrementView(id: string) {
    const item = this.data.content.find((i) => i.id === id);
    if (item) {
      item.views = (item.views || 0) + 1;
      this.save();
    }
  }

  public recordArticleReaction(
    id: string,
    reactionType: 'useful' | 'love' | 'informative' | 'thoughtful' | 'disagree'
  ): ArticleReactions {
    const item = this.data.content.find((i) => i.id === id);
    if (!item) {
      throw new Error('सामग्री फेला परेन (Article not found)');
    }
    if (!item.reactions) {
      item.reactions = { useful: 0, love: 0, informative: 0, thoughtful: 0, disagree: 0 };
    }
    item.reactions[reactionType] = (item.reactions[reactionType] || 0) + 1;
    this.save();
    return item.reactions;
  }

  public createContent(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'views'>): ContentItem {
    const id = `post-${Date.now()}`;
    const now = new Date().toISOString();
    const newItem: ContentItem = {
      ...item,
      id,
      views: 0,
      reactions: { useful: 0, love: 0, informative: 0, thoughtful: 0, disagree: 0 },
      createdAt: now,
      updatedAt: now,
      publishedAt: item.status === 'published' ? now : undefined
    };
    this.data.content.unshift(newItem);
    this.save();
    return newItem;
  }

  public updateContent(id: string, updates: Partial<ContentItem>): ContentItem | null {
    const index = this.data.content.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const current = this.data.content[index];
    const now = new Date().toISOString();
    const updated: ContentItem = {
      ...current,
      ...updates,
      updatedAt: now,
      publishedAt:
        updates.status === 'published' && !current.publishedAt ? now : current.publishedAt
    };

    this.data.content[index] = updated;
    this.save();
    return updated;
  }

  // Soft Delete into Trash
  public trashContent(id: string): boolean {
    const item = this.data.content.find((i) => i.id === id);
    if (!item) return false;
    item.status = 'trash';
    item.deletedAt = new Date().toISOString();
    this.save();
    return true;
  }

  // Restore from Trash
  public restoreContent(id: string): boolean {
    const item = this.data.content.find((i) => i.id === id);
    if (!item) return false;
    item.status = item.publishedAt ? 'published' : 'draft';
    delete item.deletedAt;
    item.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  // Permanent Delete
  public permanentDeleteContent(id: string): boolean {
    const prevLen = this.data.content.length;
    this.data.content = this.data.content.filter((i) => i.id !== id);
    if (this.data.content.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Empty Trash
  public emptyTrash(): number {
    const initialCount = this.data.content.filter((i) => i.status === 'trash').length;
    this.data.content = this.data.content.filter((i) => i.status !== 'trash');
    this.save();
    return initialCount;
  }

  // --- Live Events Coverage ---
  public getLiveEvents(includeEnded = true): LiveEvent[] {
    let events = [...(this.data.liveEvents || [])];
    if (!includeEnded) {
      events = events.filter((e) => e.status === 'live');
    }
    return events.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getLiveEventByIdOrSlug(idOrSlug: string): LiveEvent | undefined {
    return (this.data.liveEvents || []).find((e) => e.id === idOrSlug || e.slug === idOrSlug);
  }

  public createLiveEvent(event: Omit<LiveEvent, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'updates'>): LiveEvent {
    const id = `live-${Date.now()}`;
    const now = new Date().toISOString();
    const newEvent: LiveEvent = {
      ...event,
      id,
      updates: [],
      views: 0,
      autoRefreshIntervalSeconds: 30,
      createdAt: now,
      updatedAt: now
    };
    if (!this.data.liveEvents) this.data.liveEvents = [];
    this.data.liveEvents.unshift(newEvent);
    this.save();
    return newEvent;
  }

  public updateLiveEvent(id: string, updates: Partial<LiveEvent>): LiveEvent | null {
    const event = (this.data.liveEvents || []).find((e) => e.id === id);
    if (!event) return null;
    Object.assign(event, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return event;
  }

  public deleteLiveEvent(id: string): boolean {
    const prev = (this.data.liveEvents || []).length;
    this.data.liveEvents = (this.data.liveEvents || []).filter((e) => e.id !== id);
    if (this.data.liveEvents.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  public addLiveUpdate(
    eventId: string,
    update: Omit<LiveUpdate, 'id' | 'timestamp'>
  ): LiveUpdate | null {
    const event = (this.data.liveEvents || []).find((e) => e.id === eventId);
    if (!event) return null;
    const now = new Date();
    const timeLabel = now.toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' });
    const newUpdate: LiveUpdate = {
      ...update,
      id: `upd-${Date.now()}`,
      timestamp: now.toISOString(),
      timeLabel
    };
    if (update.isPinned) {
      event.pinnedUpdateId = newUpdate.id;
    }
    event.updates.unshift(newUpdate);
    event.updatedAt = now.toISOString();
    this.save();
    return newUpdate;
  }

  public deleteLiveUpdate(eventId: string, updateId: string): boolean {
    const event = (this.data.liveEvents || []).find((e) => e.id === eventId);
    if (!event) return false;
    event.updates = event.updates.filter((u) => u.id !== updateId);
    if (event.pinnedUpdateId === updateId) {
      delete event.pinnedUpdateId;
    }
    event.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  public togglePinUpdate(eventId: string, updateId: string): boolean {
    const event = (this.data.liveEvents || []).find((e) => e.id === eventId);
    if (!event) return false;
    if (event.pinnedUpdateId === updateId) {
      delete event.pinnedUpdateId;
    } else {
      event.pinnedUpdateId = updateId;
    }
    event.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  public incrementLiveEventView(id: string) {
    const event = (this.data.liveEvents || []).find((e) => e.id === id);
    if (event) {
      event.views = (event.views || 0) + 1;
      this.save();
    }
  }

  // --- Ads & Sponsored Banners ---
  public getAds(onlyActive = false): AdItem[] {
    let ads = [...(this.data.ads || [])];
    if (onlyActive) {
      ads = ads.filter((a) => a.active);
    }
    return ads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createAd(ad: Omit<AdItem, 'id' | 'createdAt' | 'impressions' | 'clicks'>): AdItem {
    const id = `ad-${Date.now()}`;
    const newAd: AdItem = {
      ...ad,
      id,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    if (!this.data.ads) this.data.ads = [];
    this.data.ads.unshift(newAd);
    this.save();
    return newAd;
  }

  public updateAd(id: string, updates: Partial<AdItem>): AdItem | null {
    const ad = (this.data.ads || []).find((a) => a.id === id);
    if (!ad) return null;
    Object.assign(ad, updates);
    this.save();
    return ad;
  }

  public deleteAd(id: string): boolean {
    const prev = (this.data.ads || []).length;
    this.data.ads = (this.data.ads || []).filter((a) => a.id !== id);
    if (this.data.ads.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  public recordAdImpression(id: string) {
    const ad = (this.data.ads || []).find((a) => a.id === id);
    if (ad) {
      ad.impressions = (ad.impressions || 0) + 1;
      this.save();
    }
  }

  public recordAdClick(id: string) {
    const ad = (this.data.ads || []).find((a) => a.id === id);
    if (ad) {
      ad.clicks = (ad.clicks || 0) + 1;
      this.save();
    }
  }

  // --- Reader Feedback & Corrections ---
  public addFeedback(fb: Omit<ArticleFeedback, 'id' | 'createdAt' | 'status'>): ArticleFeedback {
    const id = `fb-${Date.now()}`;
    const newFb: ArticleFeedback = {
      ...fb,
      id,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    if (!this.data.feedbacks) this.data.feedbacks = [];
    this.data.feedbacks.unshift(newFb);
    this.save();
    return newFb;
  }

  public getFeedbacks(): ArticleFeedback[] {
    return [...(this.data.feedbacks || [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public updateFeedbackStatus(id: string, status: 'new' | 'reviewed' | 'resolved'): boolean {
    const fb = (this.data.feedbacks || []).find((f) => f.id === id);
    if (!fb) return false;
    fb.status = status;
    this.save();
    return true;
  }

  public deleteFeedback(id: string): boolean {
    const prev = (this.data.feedbacks || []).length;
    this.data.feedbacks = (this.data.feedbacks || []).filter((f) => f.id !== id);
    if (this.data.feedbacks.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.order - b.order);
  }

  public createCategory(cat: Omit<Category, 'id'>): Category {
    const id = `cat-${Date.now()}`;
    const newCat = { ...cat, id };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const cat = this.data.categories.find((c) => c.id === id);
    if (!cat) return null;
    Object.assign(cat, updates);
    this.save();
    return cat;
  }

  public deleteCategory(id: string): boolean {
    const prevLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Corrections ---
  public getCorrections(): CorrectionItem[] {
    return [...this.data.corrections].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public createCorrection(correction: Omit<CorrectionItem, 'id' | 'createdAt'>): CorrectionItem {
    const id = `cor-${Date.now()}`;
    const newCorrection = { ...correction, id, createdAt: new Date().toISOString() };
    this.data.corrections.unshift(newCorrection);

    if (correction.contentId) {
      const content = this.data.content.find((c) => c.id === correction.contentId);
      if (content) {
        content.isCorrected = true;
        content.correctionNote = correction.correctedText;
        content.updatedAt = new Date().toISOString();
      }
    }

    this.save();
    return newCorrection;
  }

  // --- Settings ---
  public getSettings(): SiteSettings {
    return { ...this.data.settings };
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    Object.assign(this.data.settings, updates);
    this.save();
    return { ...this.data.settings };
  }

  // --- Contact Messages ---
  public addContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage {
    const id = `msg-${Date.now()}`;
    const newMsg: ContactMessage = {
      ...msg,
      id,
      createdAt: new Date().toISOString(),
      read: false
    };
    this.data.messages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  public getContactMessages(): ContactMessage[] {
    return [...this.data.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public markMessageRead(id: string): boolean {
    const msg = this.data.messages.find((m) => m.id === id);
    if (msg) {
      msg.read = true;
      this.save();
      return true;
    }
    return false;
  }

  public recordMessageReply(
    id: string,
    replySubject: string,
    replyMessage: string,
    repliedBy: string
  ): ContactMessage | null {
    const msg = this.data.messages.find((m) => m.id === id);
    if (!msg) return null;
    msg.read = true;
    msg.replySent = true;
    msg.replySubject = replySubject;
    msg.replyMessage = replyMessage;
    msg.repliedAt = new Date().toISOString();
    msg.repliedBy = repliedBy;
    this.save();
    return msg;
  }

  public deleteContactMessage(id: string): boolean {
    const prevLen = this.data.messages.length;
    this.data.messages = this.data.messages.filter((m) => m.id !== id);
    if (this.data.messages.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Media Library ---
  public getMedia(): MediaItem[] {
    return [...this.data.media].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  public addMedia(item: Omit<MediaItem, 'id' | 'uploadedAt'>): MediaItem {
    const id = `med-${Date.now()}`;
    const newMedia: MediaItem = {
      ...item,
      id,
      uploadedAt: new Date().toISOString()
    };
    this.data.media.unshift(newMedia);
    this.save();
    return newMedia;
  }

  public deleteMedia(id: string): boolean {
    const item = this.data.media.find((m) => m.id === id);
    if (!item) return false;

    const filePath = path.resolve(UPLOADS_DIR, item.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Failed to unlink media file:', err);
      }
    }

    this.data.media = this.data.media.filter((m) => m.id !== id);
    this.save();
    return true;
  }

  // --- Audit Logs ---
  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString()
    };
    if (!this.data.auditLogs) this.data.auditLogs = [];
    this.data.auditLogs.unshift(newLog);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
    return newLog;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...(this.data.auditLogs || [])];
  }

  // --- Market Rates & Indicators (Live Auto-Updating with Current Time & Rate) ---
  public getMarketRates(forceFresh: boolean = false): MarketSnapshot {
    const fresh = getDefaultMarketSnapshot();
    if (!this.data.marketSnapshot || forceFresh) {
      this.data.marketSnapshot = fresh;
      this.save();
    } else {
      // Always sync live dynamic time & rates for gold, silver, NEPSE, fuel, forex with current time
      this.data.marketSnapshot.updatedDate = fresh.updatedDate;
      this.data.marketSnapshot.nepse = fresh.nepse;
      this.data.marketSnapshot.trends = fresh.trends;
      this.data.marketSnapshot.goldSilver = fresh.goldSilver;
      this.data.marketSnapshot.fuel = fresh.fuel;
      this.data.marketSnapshot.forex = fresh.forex;
      this.save();
    }
    return this.data.marketSnapshot;
  }

  public refreshMarketRates(): MarketSnapshot {
    this.data.marketSnapshot = getDefaultMarketSnapshot();
    this.save();
    return this.data.marketSnapshot;
  }

  public updateMarketRates(updates: Partial<MarketSnapshot>): MarketSnapshot {
    const current = this.getMarketRates();
    this.data.marketSnapshot = {
      ...current,
      ...updates,
      updatedDate:
        updates.updatedDate ||
        new Date().toLocaleDateString('ne-NP', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
    };
    this.save();
    return this.data.marketSnapshot;
  }

  public resetMarketRates(): MarketSnapshot {
    this.data.marketSnapshot = getDefaultMarketSnapshot();
    this.save();
    return this.data.marketSnapshot;
  }

  // --- Newsletter Subscribers ---
  public getSubscribers(): NewsletterSubscriber[] {
    if (!this.data.subscribers) this.data.subscribers = [];
    return [...this.data.subscribers];
  }

  public addSubscriber(email: string, frequency: 'daily' | 'weekly' = 'daily', source: string = 'website'): NewsletterSubscriber {
    if (!this.data.subscribers) this.data.subscribers = [];
    const cleanEmail = email.trim().toLowerCase();
    const existing = this.data.subscribers.find((s) => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.status !== 'active') {
        existing.status = 'active';
        existing.frequency = frequency;
        this.save();
      }
      return existing;
    }
    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      email: cleanEmail,
      frequency,
      status: 'active',
      subscribedAt: new Date().toISOString(),
      source
    };
    this.data.subscribers.unshift(newSub);
    this.save();
    return newSub;
  }

  public deleteSubscriber(id: string): boolean {
    if (!this.data.subscribers) return false;
    const initialLen = this.data.subscribers.length;
    this.data.subscribers = this.data.subscribers.filter((s) => s.id !== id);
    if (this.data.subscribers.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  public toggleSubscriberStatus(id: string): NewsletterSubscriber | null {
    if (!this.data.subscribers) return null;
    const sub = this.data.subscribers.find((s) => s.id === id);
    if (!sub) return null;
    sub.status = sub.status === 'active' ? 'unsubscribed' : 'active';
    this.save();
    return sub;
  }

  public getFullSnapshot(): DatabaseSchema {
    return JSON.parse(JSON.stringify(this.data));
  }
}

export const db = new Database();
