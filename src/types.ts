export type ContentStatus = 'draft' | 'published' | 'archived' | 'trash';
export type DisclaimerType = 'none' | 'financial' | 'health' | 'legal' | 'factcheck' | 'satire';

export interface ArticleReactions {
  useful: number;
  love: number;
  informative?: number;
  insightful?: number;
  thoughtful?: number;
  question?: number;
  needsWork?: number;
  disagree?: number;
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
  tags?: string[];
  isCorrected?: boolean;
  correctionNote?: string;
  seoTitle?: string;
  seoDescription?: string;
  // Editorial Verification & Licensing
  verificationNotes?: string;
  dateChecked?: string;
  factCheckStatus?: 'official_record' | 'confirmed' | 'alleged' | 'disputed' | 'unverified';
  isIllustrativeVisual?: boolean;
  imageLicenseType?: 'original' | 'official_pr' | 'licensed' | 'ai_illustrative';
  imageAttribution?: string;
  // Disclaimer & Sensitivity
  disclaimerType?: DisclaimerType;
  customDisclaimer?: string;
  // Reactions & Reader Engagement
  reactions?: ArticleReactions;
  // Scheduling & Planning
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface LiveUpdate {
  id: string;
  timestamp: string;
  time?: string;
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
  category?: string;
  coverImage?: string;
  bannerImage?: string;
  updates: LiveUpdate[];
  pinnedUpdateId?: string;
  views?: number;
  autoRefreshIntervalSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdItem {
  id: string;
  title: string;
  clientName?: string;
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

export interface MarketRateTrendPoint {
  date: string;
  nepse: number;
  goldFine: number; // per tola NPR
  petrol: number; // per litre NPR
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

export interface ArticleFeedback {
  id: string;
  articleId: string;
  articleTitle: string;
  type?: 'reaction' | 'correction' | 'tip' | 'general';
  feedbackType?: 'reaction' | 'correction' | 'tip' | 'general';
  message?: string;
  comment?: string;
  userName?: string;
  contactName?: string;
  userEmail?: string;
  contactEmailOrPhone?: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string; // Nepali
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

export interface SocialAccountLink {
  id: string;
  platform: 'facebook' | 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'whatsapp' | 'threads' | 'linkedin' | 'viber' | 'bluesky' | 'custom';
  label: string;
  url: string;
  active: boolean;
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
  disallowSearchIndexing: boolean;
  footerText: string;
  seoKeywords: string;
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
  googleAnalyticsId?: string;
  metaPixelId?: string;
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

  // Maintenance Mode (मर्मत सम्भार मोड)
  maintenanceModeActive?: boolean;
  maintenanceModeMessage?: string;
  maintenanceEstimatedTime?: string;

  // Gmail & Email Newsletter Dispatcher Configuration
  emailSenderName?: string;
  emailSenderAddress?: string;
  emailSmtpHost?: string;
  emailSmtpPort?: number;
  emailSmtpUser?: string;
  emailSmtpPass?: string;
  emailServiceActive?: boolean;

  // Resend Email API
  resendApiKey?: string;
  resendSenderEmail?: string;

  // Real-Time Zero-Loss Inquiry & Collaboration Notification System
  adminNotificationEmail?: string;
  inquiryWebhookUrl?: string;
  autoReplyEnabled?: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  frequency: 'daily' | 'weekly';
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  source?: string;
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

export type UserRole = 'owner' | 'editor' | 'reporter' | 'moderator' | 'editor_in_chief' | 'sub_editor';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName?: string;
}

export interface TeamMember {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
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
    | 'backup_restore';
  targetType: 'content' | 'category' | 'correction' | 'live_event' | 'ad' | 'team' | 'settings' | 'auth' | 'database' | 'social';
  targetTitle: string;
  details?: string;
  timestamp: string;
  userId: string;
}

export interface SystemStatus {
  status: string;
  backend: string;
  port: number;
  database: {
    type: string;
    path: string;
    contentCount: number;
    trashCount: number;
    liveEventsCount: number;
    adsCount: number;
    categoriesCount: number;
    correctionsCount: number;
    messagesCount: number;
    feedbackCount: number;
    mediaCount: number;
    auditLogsCount: number;
    activeSessions: number;
    teamCount: number;
  };
  performance: {
    uptimeMinutes: number;
    memoryRssMb: number;
    memoryHeapUsedMb: number;
  };
  freeBudgetNotice: string;
}

export interface SavedArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  featuredImage?: string;
  author: string;
  savedAt: string;
}
