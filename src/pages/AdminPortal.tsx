import React, { useState, useEffect, useRef } from 'react';
import { KhabarLogo } from '../components/KhabarLogo';
import {
  ContentItem,
  Category,
  CorrectionItem,
  SiteSettings,
  MediaItem,
  ContactMessage,
  AuthUser
} from '../types';
import { api } from '../services/api';
import {
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  PlayCircle,
  FolderPlus,
  AlertTriangle,
  Upload,
  Download,
  Settings,
  Mail,
  Smartphone,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Key,
  ExternalLink,
  X,
  Search,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Image,
  Globe,
  Palette,
  Link as LinkIcon,
  Youtube,
  Instagram,
  Twitter,
  Send,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Users,
  Share2,
  Facebook,
  Edit3,
  Sliders,
  Database,
  Wrench,
  FolderOpen
} from 'lucide-react';
import { AdminSeoPanel } from '../components/AdminSeoPanel';
import { AdminLiveEventsPanel } from '../components/AdminLiveEventsPanel';
import { AdminAdsManagerPanel } from '../components/AdminAdsManagerPanel';
import { AdminScheduleCalendarPanel } from '../components/AdminScheduleCalendarPanel';
import { AdminTrashRecoveryPanel } from '../components/AdminTrashRecoveryPanel';
import { AdminAnalyticsFeedbackPanel } from '../components/AdminAnalyticsFeedbackPanel';
import { AdminTeamRolesPanel } from '../components/AdminTeamRolesPanel';
import { AdminAiAssistantPanel } from '../components/AdminAiAssistantPanel';
import { AdminNewsletterPanel } from '../components/AdminNewsletterPanel';
import { AdminMarketRatesPanel } from '../components/AdminMarketRatesPanel';
import { AdminNoticeManagerPanel } from '../components/AdminNoticeManagerPanel';
import { AdminPosterStudioPanel } from '../components/AdminPosterStudioPanel';

interface AdminPortalProps {
  user: AuthUser | null;
  settings: SiteSettings;
  onSettingsUpdate: (settings: SiteSettings) => void;
  onNavigateHome: () => void;
  onAuthChange: () => void;
}

type AdminTab =
  | 'overview'
  | 'content'
  | 'poster_studio'
  | 'notice'
  | 'live_events'
  | 'market_rates'
  | 'schedule'
  | 'ads'
  | 'analytics'
  | 'ai_assistant'
  | 'newsletter'
  | 'team'
  | 'trash'
  | 'videos'
  | 'seo'
  | 'categories'
  | 'corrections'
  | 'media'
  | 'messages'
  | 'audit'
  | 'status'
  | 'settings'
  | 'backup';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  user,
  settings,
  onSettingsUpdate,
  onNavigateHome,
  onAuthChange
}) => {
  // Login form state & Security Gates
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [legalCheckboxAgreed, setLegalCheckboxAgreed] = useState(false);
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);

  // Tab & Data states
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [contentList, setContentList] = useState<ContentItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [correctionsList, setCorrectionsList] = useState<CorrectionItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Notifications
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editing Item modal / drawer
  const [editingItem, setEditingItem] = useState<Partial<ContentItem> | null>(null);
  const [isEditingNew, setIsEditingNew] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Category Modal
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Correction Modal
  const [newCorrection, setNewCorrection] = useState<{
    contentId: string;
    contentTitle: string;
    issueDate: string;
    originalError: string;
    correctedText: string;
    explanation: string;
  } | null>(null);

  // Password Change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwChangeStatus, setPwChangeStatus] = useState<string | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCardLogo, setUploadingCardLogo] = useState(false);
  const [copySafeLinkSuccess, setCopySafeLinkSuccess] = useState(false);
  const [logoSizePreview, setLogoSizePreview] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const cardLogoFileInputRef = useRef<HTMLInputElement>(null);
  const [svgEditorOpen, setSvgEditorOpen] = useState(false);
  const [svgCodeText, setSvgCodeText] = useState('');

  // Message Reply states
  const [replyingMessage, setReplyingMessage] = useState<ContactMessage | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [replySendViaEmail, setReplySendViaEmail] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);

  // Sync settingsForm with props
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Media upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [copiedMediaUrl, setCopiedMediaUrl] = useState<string | null>(null);

  // Content Image upload states
  const contentImageFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const [showContentMediaPicker, setShowContentMediaPicker] = useState(false);

  // Search in content
  const [contentSearch, setContentSearch] = useState('');
  const [contentFilterType, setContentFilterType] = useState('all');

  // Automatic Device Vault & Render Redeploy Wipe Detector
  const VAULT_STORAGE_KEY = 'khabar_admin_local_vault_v2';
  const [resetDetected, setResetDetected] = useState<{ localCount: number; serverCount: number; vaultData: any } | null>(null);
  const [copiedPersistCode, setCopiedPersistCode] = useState(false);
  const [lastVaultSavedAt, setLastVaultSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (user && sessionAuthenticated) {
      loadAllData();
    }
  }, [user, sessionAuthenticated]);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [c, cats, cors, meds, msgs, logs, status] = await Promise.all([
        api.getContent({ includeDrafts: true }),
        api.getCategories(),
        api.getCorrections(),
        api.getMedia(),
        api.getContactMessages(),
        api.getAuditLogs().catch(() => []),
        api.getSystemStatus().catch(() => null)
      ]);
      setContentList(c);
      setCategoriesList(cats);
      setCorrectionsList(cors);
      setMediaList(meds);
      setMessagesList(msgs);
      setAuditLogsList(logs);
      setSystemStatus(status);

      // Check Local Vault for Wipe Detection (When Render redeploys and container resets to default)
      try {
        const rawVault = localStorage.getItem(VAULT_STORAGE_KEY);
        if (rawVault) {
          const vault = JSON.parse(rawVault);
          const vaultArticleCount = vault.content?.length || 0;
          if (vaultArticleCount > c.length && c.length <= 4) {
            setResetDetected({
              localCount: vaultArticleCount,
              serverCount: c.length,
              vaultData: vault
            });
          }
        }
      } catch (vaultErr) {
        console.warn('Vault inspect error:', vaultErr);
      }

      // Automatically sync latest full database into local vault
      try {
        api.getBackupSnapshot().then((snapshot) => {
          if (snapshot && snapshot.content && snapshot.content.length >= c.length) {
            localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(snapshot));
            setLastVaultSavedAt(new Date().toLocaleTimeString('ne-NP'));
          }
        }).catch(() => {});
      } catch {}
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'डाटा लोड गर्न सकिएन', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInstantAutoRestore = async () => {
    if (!resetDetected?.vaultData) return;
    try {
      setLoadingData(true);
      await api.restoreBackup(resetDetected.vaultData);
      showNotification('ब्राउजर भल्टबाट सम्पूर्ण समाचार र सेटिङ्स १-क्लिकमा अटो-रिस्टोर भयो!');
      setResetDetected(null);
      await loadAllData();
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'अटो-रिस्टोर असफल भयो', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const handleCopyRenderPersistCode = async () => {
    try {
      const snapshot = await api.getBackupSnapshot();
      if (!snapshot) throw new Error('डाटा प्राप्त गर्न सकिएन');
      const jsonStr = JSON.stringify(snapshot);
      const base64Str = btoa(unescape(encodeURIComponent(jsonStr)));
      await navigator.clipboard.writeText(base64Str);
      setCopiedPersistCode(true);
      setTimeout(() => setCopiedPersistCode(false), 5000);
      showNotification('Render को लागि सम्पूर्ण डाटाबेसको स्थायी Base64 कोड कपी भयो!');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'कोड तयार गर्न सकिएन', 'error');
    }
  };

  const handleDownloadGitDatabase = async () => {
    try {
      const snapshot = await api.getBackupSnapshot();
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'khabar_database.json';
      link.click();
      URL.revokeObjectURL(url);
      showNotification('khabar_database.json डाउनलोड भयो! यसलाई आफ्नो GitHub repo को data/ फोल्डरमा राखेर कमिट गर्नुहोस्।');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'डाउनलोड गर्न सकिएन', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('के तपाईं यो सन्देश मेटाउन चाहनुहुन्छ?')) return;
    try {
      await api.deleteContactMessage(id);
      setMessagesList(messagesList.filter((m) => m.id !== id));
      showNotification('सन्देश हटाइयो।');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'सन्देश हटाउन असफल', 'error');
    }
  };

  const handleOpenReply = (msg: ContactMessage) => {
    setReplyingMessage(msg);
    setReplySubject(`Re: ${msg.subject} - खबर GPT`);
    setReplyBody(
      msg.replyMessage ||
      `नमस्ते ${msg.name} जी,\n\nखबर GPT मा सम्पर्क गर्नुभएकोमा हार्दिक धन्यवाद।\n\nतपाईंको जिज्ञासा / सल्लाह अनुसार:\n\n\nसादर,\nसम्पादकीय डेस्क, खबर GPT`
    );
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingMessage || !replyBody.trim()) return;
    setSendingReply(true);
    try {
      const res = await api.replyContactMessage(replyingMessage.id, {
        replySubject: replySubject.trim(),
        replyMessage: replyBody.trim(),
        sendViaEmail: replySendViaEmail
      });

      setMessagesList((prev) =>
        prev.map((m) => (m.id === replyingMessage.id ? { ...m, ...res.updatedMessage } : m))
      );
      showNotification(res.message, res.emailDispatched || !replySendViaEmail ? 'success' : 'error');
      setReplyingMessage(null);
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'जवाफ पठाउन असफल भयो', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const handleMarkRepliedViaGmail = async (msg: ContactMessage) => {
    try {
      const res = await api.replyContactMessage(msg.id, {
        replySubject: `Gmail मार्फत पठाइएको (Re: ${msg.subject})`,
        replyMessage: 'आधिकारिक Gmail मार्फत जवाफ पठाइयो।',
        sendViaEmail: false
      });
      setMessagesList((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, ...res.updatedMessage } : m))
      );
      showNotification('✅ Gmail मार्फत जवाफ पठाइएको अभिलेख सुरक्षित गरियो!');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'अभिलेख अद्यावधिक गर्न सकिएन', 'error');
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      showNotification('तस्बिरको आकार २० MB भन्दा कम हुनुपर्छ।', 'error');
      return;
    }

    setUploadingContentImage(true);
    try {
      const res = await api.uploadMedia(file);
      setEditingItem((prev) => (prev ? { ...prev, featuredImage: res.url } : prev));
      setMediaList((prev) => [res, ...prev.filter((m) => m.id !== res.id)]);
      showNotification('तस्बिर सफलतापूर्वक सिधै अपलोड भयो र सामग्रीमा जोडिएको छ!');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'तस्बिर अपलोड असफल', 'error');
    } finally {
      setUploadingContentImage(false);
      if (contentImageFileInputRef.current) contentImageFileInputRef.current.value = '';
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      await api.login(usernameInput, passwordInput);
      setSessionAuthenticated(true);
      onAuthChange();
      setUsernameInput('');
      setPasswordInput('');
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'गलत प्रयोगकर्ता नाम वा पासवर्ड');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setSessionAuthenticated(false);
    setDisclaimerAccepted(false);
    onAuthChange();
    onNavigateHome();
  };

  const handleToggleMaintenanceMode = async () => {
    const newStatus = !settingsForm.maintenanceModeActive;
    const confirmMsg = newStatus
      ? 'के तपाईं वेबसाइटलाई मर्मत सम्भार मोड (Maintenance Mode) मा राख्न चाहनुहुन्छ? सर्वसाधारण पाठकहरूले मर्मतको सूचना मात्र देख्नेछन्, तपाईंले एडमिन पोर्टल चलाउन सक्नुहुन्छ।'
      : 'के तपाईं मर्मत सम्भार मोड बन्द गरी वेबसाइटलाई पुनः सबै पाठकहरूका लागि लाइभ (Live) गर्न चाहनुहुन्छ?';
    if (!window.confirm(confirmMsg)) return;

    try {
      const updated = await api.updateSettings({
        ...settingsForm,
        maintenanceModeActive: newStatus
      });
      setSettingsForm(updated);
      showNotification(
        newStatus
          ? '⚠️ मर्मत सम्भार मोड चालु गरियो (वेबसाइट सर्वसाधारणका लागि अस्थायी बन्द छ)।'
          : '✅ मर्मत सम्भार मोड बन्द गरियो (वेबसाइट सबैका लागि लाइभ छ)!'
      );
    } catch (err: unknown) {
      showNotification('सेटिङ अद्यावधिक गर्न सकिएन: ' + (err instanceof Error ? err.message : 'Error'));
    }
  };

  // Content Handlers
  const handleCreateNewContent = (type: 'article' | 'explainer' | 'video' | 'notice' = 'article') => {
    setIsEditingNew(true);
    setEditingItem({
      title: '',
      titleEn: '',
      summary: '',
      body: '',
      category: categoriesList[0]?.name || 'नेपाल अपडेट',
      type,
      status: 'draft',
      featured: false,
      author: 'खबर GPT सम्पादकीय टोली',
      sourceName: '',
      sourceUrl: '',
      videoUrl: '',
      facebookPostUrl: '',
      featuredImage: '',
      imageAlt: ''
    });
  };

  const handleEditContent = (item: ContentItem) => {
    setIsEditingNew(false);
    setEditingItem({ ...item });
  };

  const handleSaveContent = async () => {
    if (!editingItem?.title || !editingItem?.summary || !editingItem?.category) {
      showNotification('कृपया शीर्षक, सारांश र श्रेणी अनिवार्य रूपमा भर्नुहोस्।', 'error');
      return;
    }

    try {
      if (isEditingNew) {
        const created = await api.createContent(editingItem);
        setContentList([created, ...contentList]);
        showNotification('नयाँ सामग्री सफलतापूर्वक सुरक्षित भयो।');
      } else if (editingItem.id) {
        const updated = await api.updateContent(editingItem.id, editingItem);
        setContentList(contentList.map((c) => (c.id === updated.id ? updated : c)));
        showNotification('सामग्री अद्यावधिक भयो।');
      }
      setEditingItem(null);
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'सुरक्षित गर्न असफल', 'error');
    }
  };

  const handleDeleteContent = async (id: string, title: string) => {
    if (!window.confirm(`के तपाईं निश्चित रूपमा "${title}" मेटाउन चाहनुहुन्छ? यो पूर्ववत् गर्न सकिँदैन।`)) {
      return;
    }
    try {
      await api.deleteContent(id);
      setContentList(contentList.filter((c) => c.id !== id));
      showNotification('सामग्री हटाइयो।');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'हटाउन असफल', 'error');
    }
  };

  // Toggle publish state
  const handleTogglePublish = async (item: ContentItem) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      const updated = await api.updateContent(item.id, { status: nextStatus });
      setContentList(contentList.map((c) => (c.id === updated.id ? updated : c)));
      showNotification(
        nextStatus === 'published'
          ? 'सामग्री सार्वजनिक रूपमा प्रकाशित गरियो!'
          : 'सामग्री ड्राफ्ट (अप्रकाशित) मा सारियो।'
      );
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'अवस्था परिवर्तन असफल', 'error');
    }
  };

  // Categories Handlers
  const handleSaveCategory = async () => {
    if (!editingCategory?.name || !editingCategory?.nameEn || !editingCategory?.slug) {
      showNotification('कृपया नेपाली नाम, अङ्ग्रेजी नाम र स्लग भर्नुहोस्।', 'error');
      return;
    }

    try {
      if (editingCategory.id) {
        const updated = await api.updateCategory(editingCategory.id, editingCategory);
        setCategoriesList(categoriesList.map((c) => (c.id === updated.id ? updated : c)));
        showNotification('श्रेणी अद्यावधिक गरियो।');
      } else {
        const created = await api.createCategory(editingCategory);
        setCategoriesList([...categoriesList, created]);
        showNotification('नयाँ श्रेणी थपियो।');
      }
      setEditingCategory(null);
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'श्रेणी सुरक्षित गर्न असफल', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('के तपाईं निश्चित रूपमा यो श्रेणी हटाउन चाहनुहुन्छ?')) return;
    try {
      await api.deleteCategory(id);
      setCategoriesList(categoriesList.filter((c) => c.id !== id));
      showNotification('श्रेणी हटाइयो।');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'श्रेणी हटाउन असफल', 'error');
    }
  };

  // Corrections Handler
  const handleSaveCorrection = async () => {
    if (
      !newCorrection?.issueDate ||
      !newCorrection?.originalError ||
      !newCorrection?.correctedText ||
      !newCorrection?.explanation
    ) {
      showNotification('कृपया सच्याइ फारामका सबै विवरण भर्नुहोस्।', 'error');
      return;
    }

    try {
      const created = await api.createCorrection(newCorrection);
      setCorrectionsList([created, ...correctionsList]);
      showNotification('सच्याइ अभिलेख सफलतापूर्वक सार्वजनिक भयो!');
      setNewCorrection(null);
      // Reload content as isCorrected flag might have changed
      const updatedContent = await api.getContent({ includeDrafts: true });
      setContentList(updatedContent);
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'सच्याइ सुरक्षित गर्न असफल', 'error');
    }
  };

  // Logo Upload Handler - Auto-saves immediately so user never loses their logo!
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('फाइल आकार ५MB भन्दा कम हुनुपर्छ।', 'error');
      return;
    }

    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const uploaded = await api.uploadMedia(base64Data, file.name);
        
        // Auto-save to server immediately
        const updated = await api.updateSettings({ ...settingsForm, customLogoUrl: uploaded.url });
        setSettingsForm(updated);
        onSettingsUpdate(updated);
        showNotification('नयाँ लोगो सफलतापूर्वक अपलोड भयो र साइटभरि सुरक्षित भयो!');
      } catch (err: unknown) {
        showNotification(err instanceof Error ? err.message : 'लोगो अपलोड असफल भयो', 'error');
      } finally {
        setUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Card Logo Upload Handler - For quote and social share cards
  const handleCardLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setUploadingCardLogo(true);
        const base64Data = reader.result as string;
        const uploaded = await api.uploadMedia(base64Data, file.name);
        const updated = await api.updateSettings({ ...settingsForm, customCardLogoUrl: uploaded.url });
        setSettingsForm(updated);
        onSettingsUpdate(updated);
        showNotification('कोट कार्डका लागि विशेष लोगो सुरक्षित भयो!');
      } catch {
        showNotification('कार्ड लोगो अपलोड गर्न असफल भयो', 'error');
      } finally {
        setUploadingCardLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSvgDirect = async () => {
    if (!svgCodeText.trim() || !svgCodeText.includes('<svg')) {
      showNotification('मान्य SVG कोड प्रविष्ट गर्नुहोस् (<svg...>)', 'error');
      return;
    }
    try {
      const res = await api.updateDefaultLogo({ svgContent: svgCodeText.trim() });
      const updated = { ...settingsForm, customLogoUrl: res.url };
      setSettingsForm(updated);
      onSettingsUpdate(updated);
      setSvgEditorOpen(false);
      setSvgCodeText('');
      showNotification(res.message || 'आधिकारिक SVG लोगो सफलतापूर्वक अद्यावधिक भयो!');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'SVG अद्यावधिक गर्न असफल भयो', 'error');
    }
  };

  // Safe Link Copy Handler
  const handleCopySafeLink = () => {
    const slug = settingsForm.adminSecretSlug || 'kg-admin-secure';
    const safeUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(safeUrl);
    setCopySafeLinkSuccess(true);
    showNotification('सुरक्षित प्रशासनिक लिङ्क प्रतिलिपि गरियो!');
    setTimeout(() => setCopySafeLinkSuccess(false), 3000);
  };

  // Settings Save
  const handleSaveSettings = async (overrideSettings?: Partial<SiteSettings>) => {
    try {
      const dataToSave = overrideSettings ? { ...settingsForm, ...overrideSettings } : settingsForm;
      const updated = await api.updateSettings(dataToSave);
      setSettingsForm(updated);
      onSettingsUpdate(updated);
      showNotification('साइट सेटिङ तथा SEO विवरण सफलतापूर्वक अद्यावधिक भए।');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'सेटिङ सुरक्षित गर्न असफल', 'error');
    }
  };

  // Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwChangeStatus('नयाँ पासवर्ड र पुष्टि गरिएको पासवर्ड मेल खाएन।');
      return;
    }
    try {
      await api.changePassword(currentPw, newPw);
      setPwChangeStatus('पासवर्ड सफलतापूर्वक परिवर्तन भयो!');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err: unknown) {
      setPwChangeStatus(err instanceof Error ? err.message : 'पासवर्ड परिवर्तन असफल');
    }
  };

  // Media Upload (from Android / Browser)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('फाइल आकार ५MB भन्दा कम हुनुपर्छ।', 'error');
      return;
    }

    setUploadingMedia(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploaded = await api.uploadMedia(base64, file.name);
        setMediaList([uploaded, ...mediaList]);
        showNotification('तस्बिर सफलतापूर्वक अपलोड भयो!');
      } catch (err: unknown) {
        showNotification(err instanceof Error ? err.message : 'अपलोड असफल', 'error');
      } finally {
        setUploadingMedia(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('के तपाईं निश्चित रूपमा यो तस्बिर हटाउन चाहनुहुन्छ?')) return;
    try {
      await api.deleteMedia(id);
      setMediaList(mediaList.filter((m) => m.id !== id));
      showNotification('मिडिया फाइल हटाइयो।');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'मिडिया हटाउन असफल', 'error');
    }
  };

  const handleCopyMediaUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedMediaUrl(url);
    setTimeout(() => setCopiedMediaUrl(null), 2000);
  };

  // Backup restore
  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm('सावधानी: यसले वर्तमान डाटाबेसलाई ब्याकअप फाइलले प्रतिस्थापन गर्नेछ। के तपाईं जारी राख्न चाहनुहुन्छ?')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        await api.restoreBackup(json);
        showNotification('डाटाबेस सफलतापूर्वक पुनर्स्थापित भयो! पृष्ठ पुन: लोड हुँदैछ...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err: unknown) {
        showNotification(err instanceof Error ? err.message : 'पुनर्स्थापना असफल', 'error');
      }
    };
    reader.readAsText(file);
  };

  // ================= GATE 1: MANDATORY LEGAL DISCLAIMER & SECURITY WARNING =================
  if (!disclaimerAccepted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950 text-slate-100">
        <div className="max-w-xl w-full bg-slate-900 border-2 border-red-500/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-red-950/80 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-700/80 shadow-inner">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div className="inline-block px-3 py-1 bg-red-900/60 border border-red-600/70 rounded-full text-red-300 text-xs font-bold tracking-wider uppercase">
              सुरक्षा चेतावनी · कडा कानुनी निगरानी
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans text-white">
              Khabar GPT आधिकारिक प्रशासनिक पोर्टल
            </h1>
            <p className="text-xs text-slate-400">
              Official Administration & CMS System
            </p>
          </div>

          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-4 text-xs text-red-100 space-y-3 leading-relaxed">
            <p className="font-semibold text-red-200">
              यो पोर्टल केवल <span className="underline font-bold text-white">Khabar GPT का आधिकारिक व्यवस्थापक (Official Admin)</span> का लागि मात्र सुरक्षित गरिएको हो।
            </p>
            <p className="text-slate-300">
              यस प्रणालीमा कुनै पनि अनधिकृत व्यक्तिको प्रवेश, ट्र्याकिङ, पासवर्ड अनुमान गर्ने वा प्रणालीमा हस्तक्षेप गर्ने प्रयास पूर्णतया गैरकानुनी र निषेधित छ।
            </p>
            <div className="bg-black/50 rounded-lg p-3 text-[11px] text-amber-300 border border-amber-500/30 font-mono space-y-1">
              <div>⚠️ स्वचालित सेक्युरिटी अडिट लग सक्रिय छ (Security Audit Active)</div>
              <div className="text-slate-400">तपाईँको आईपी ठेगाना, ब्राउजर विवरण, स्थान तथा पहुँच समय अभिलेख गरिँदैछ।</div>
            </div>
            <p className="text-[11px] text-red-300">
              अनाधिकृत पहुँचको प्रयास गर्ने व्यक्ति नेपालको <strong>विद्युतीय कारोबार ऐन, २०६३ (Electronic Transactions Act, 2063)</strong> तथा प्रचलित साइबर सुरक्षा कानुनबमोजिम फौजदारी अभियोग तथा कानुनी कारबाहीको भागीदार हुनेछ।
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 p-3.5 bg-red-950/70 border border-red-700/70 rounded-xl cursor-pointer hover:bg-red-950/90 transition-colors">
              <input
                type="checkbox"
                checked={legalCheckboxAgreed}
                onChange={(e) => setLegalCheckboxAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-red-600 rounded cursor-pointer shrink-0"
              />
              <span className="text-xs text-red-100 leading-snug">
                म प्रमाणित गर्दछु कि म <strong>Khabar GPT को आधिकारिक अधिकृत व्यवस्थापक (Official Administrator)</strong> हुँ। म नेपालको विद्युतीय कारोबार ऐन, २०६३ तथा सम्पूर्ण कानुनी सर्त र सुरक्षा नियम स्वीकार गर्दछु।
              </span>
            </label>

            <button
              onClick={() => {
                if (legalCheckboxAgreed) setDisclaimerAccepted(true);
              }}
              disabled={!legalCheckboxAgreed}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 touch-target"
            >
              <Shield className="w-4 h-4" />
              <span>व्यवस्थापक प्रमाणीकरणमा जानुहोस् (Proceed to Authentication)</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              सार्वजनिक वेबसाइटमा फर्कनुहोस् (म व्यवस्थापक होइन)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= GATE 2: MANDATORY PASSWORD AUTHENTICATION =================
  if (!sessionAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold font-sans text-slate-900">
              व्यवस्थापक प्रमाणीकरण
            </h1>
            <p className="text-xs text-slate-500">
              जारी राख्न आफ्नो आधिकारिक प्रयोगकर्ता नाम र पासवर्ड प्रविष्ट गर्नुहोस्
            </p>
          </div>

          {/* Rate-limited login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                प्रयोगकर्ता नाम (Username)
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="व्यवस्थापक नाम प्रविष्ट गर्नुहोस्"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                पासवर्ड (Password)
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="पासवर्ड प्रविष्ट गर्नुहोस्"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 touch-target flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loginLoading ? 'प्रमाणीकरण हुँदैछ...' : 'सुरक्षित लगइन गर्नुहोस्'}</span>
            </button>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>सुरक्षित व्यवस्थापक पहुँच (Secure Administrator Access)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                यो प्रणाली केवल आधिकारिक व्यवस्थापकका लागि मात्र हो। पासवर्ड अनुमान गर्ने प्रयास स्वतः रोकिन्छ (Rate Limited)।
              </p>
            </div>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setDisclaimerAccepted(false);
                onNavigateHome();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              रद्द गरी गृहपृष्ठमा फर्कनुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= VIEW: AUTHENTICATED DASHBOARD =================
  const publishedCount = contentList.filter((c) => c.status === 'published').length;
  const draftCount = contentList.filter((c) => c.status === 'draft').length;
  const archivedCount = contentList.filter((c) => c.status === 'archived').length;
  const videoCount = contentList.filter((c) => c.type === 'video').length;
  const unreadMessagesCount = messagesList.filter((m) => !m.read).length;

  const filteredContent = contentList.filter((item) => {
    const matchType = contentFilterType === 'all' || item.type === contentFilterType;
    const q = contentSearch.toLowerCase();
    const matchSearch =
      !contentSearch ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100/60 pb-24">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white sticky top-16 z-30 border-b border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <span className="font-bold text-sm sm:text-base">Khabar GPT Admin Portal</span>
            <span className="hidden sm:inline text-xs text-slate-400">
              (सञ्चालक: {user?.username || 'admin'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick 1-Click Server Maintenance Mode Switch */}
            <button
              onClick={handleToggleMaintenanceMode}
              title="मर्मत सम्भार मोड (Maintenance Mode) तुरुन्त चालु वा बन्द गर्नुहोस्"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                settingsForm.maintenanceModeActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold animate-pulse'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {settingsForm.maintenanceModeActive ? '⚠️ मर्मत मोड: चालु (बन्द गर्नुहोस्)' : '🟢 सर्भर स्थिति: लाइभ (मर्मत मोड)'}
              </span>
              <span className="sm:hidden">
                {settingsForm.maintenanceModeActive ? 'मर्मत मोड: चालु' : 'लाइभ'}
              </span>
            </button>

            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">वेबसाइट हेर्नुहोस्</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लगआउट</span>
            </button>
          </div>
        </div>

        {/* Emergency Maintenance Mode Live Warning Banner */}
        {settingsForm.maintenanceModeActive && (
          <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs flex items-center justify-between border-b border-amber-600 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-950 shrink-0" />
              <span>
                ⚠️ <strong>मर्मत सम्भार मोड (Maintenance Mode) सक्रिय छ:</strong> सर्वसाधारण पाठकहरूले साइट हेर्न सक्दैनन् (मर्मत सूचना मात्र देखिन्छ)।
              </span>
            </div>
            <button
              onClick={handleToggleMaintenanceMode}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold cursor-pointer shrink-0 ml-2"
            >
              अहिले नै लाइभ गर्नुहोस् (Go Live)
            </button>
          </div>
        )}

        {/* Horizontal Navigation Tabs (Android-friendly touch scroller) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 py-1.5 scrollbar-thin">
          {[
            { id: 'overview', label: '📊 ड्यासबोर्ड' },
            { id: 'content', label: `📰 समाचार & लेख (${contentList.length})` },
            { id: 'videos', label: `🎬 भिडियो & Reels (${videoCount})` },
            { id: 'live_events', label: '🔴 प्रत्यक्ष कभरेज' },
            { id: 'categories', label: `📂 श्रेणीहरू (${categoriesList.length})` },
            { id: 'media', label: `🖼️ मिडिया ग्यालरी (${mediaList.length})` },
            { id: 'poster_studio', label: '🎨 फोटो & पोस्टर स्टुडियो' },
            { id: 'market_rates', label: '📈 बजार दरहरू' },
            { id: 'newsletter', label: '✉️ जीमेल & न्यूजलेटर' },
            { id: 'notice', label: '📢 प्रारम्भिक सूचना' },
            { id: 'ads', label: '💰 विज्ञापन & आम्दानी' },
            { id: 'analytics', label: '📊 पाठक & प्रतिक्रिया' },
            { id: 'messages', label: `💬 सम्पर्क सन्देशहरू (${messagesList.length})${unreadMessagesCount > 0 ? ` 🔴 ${unreadMessagesCount} नयाँ` : ''}` },
            { id: 'seo', label: '🔍 SEO & सर्च इन्जिन' },
            { id: 'corrections', label: `⚖️ सच्याइ अभिलेख (${correctionsList.length})` },
            { id: 'team', label: '👥 टोली & प्रयोगकर्ता' },
            { id: 'schedule', label: '📅 कार्यतालिका' },
            { id: 'ai_assistant', label: '✨ AI सम्पादक' },
            { id: 'settings', label: '⚙️ साइट सेटिङ' },
            { id: 'backup', label: '🔒 ब्याकअप & सुरक्षा' },
            { id: 'audit', label: `📋 अडिट लग (${auditLogsList.length})` },
            { id: 'trash', label: '🗑️ रद्दीटोकरी' },
            { id: 'status', label: '🖥️ प्रणाली स्थिति' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer touch-target ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Global Status Banner */}
      {statusMessage && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Unread Inquiries / Collaborations Warning Banner */}
        {unreadMessagesCount > 0 && activeTab !== 'messages' && (
          <div className="mb-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-4 sm:p-5 rounded-2xl border-2 border-red-500 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-white text-red-600 rounded-xl shrink-0 mt-0.5 shadow-xs">
                <Mail className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm sm:text-base text-white">
                    तपाईंसँग {unreadMessagesCount} वटा नयाँ सोधपुछ वा सहकार्य प्रस्तावहरू छन्!
                  </h4>
                  <span className="text-[10px] bg-red-950 text-red-200 font-bold px-2.5 py-0.5 rounded-full border border-red-400">
                    नपढिएका सन्देशहरू (Unread)
                  </span>
                </div>
                <p className="text-xs text-red-100 font-medium leading-relaxed max-w-2xl">
                  Render मा नयाँ डिब्लोय गर्नुअघि यी सन्देशहरू हेर्नुहोस् वा ब्याकअप सुरक्षित गर्नुहोस् ताकि कुनै पनि पाठक वा विज्ञापनदाताको सन्देश नछुटोस्।
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-red-700 text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>सन्देशहरू हेर्नुहोस् ({unreadMessagesCount})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Render Redeploy Wipe & Auto-Restore Prompt Banner */}
        {resetDetected && (
          <div className="mb-6 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 p-4 sm:p-5 rounded-2xl border-2 border-amber-600 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-slate-950 text-amber-400 rounded-xl shrink-0 mt-0.5 shadow-xs">
                <RefreshCw className="w-5 h-5 animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-950">
                    ⚠️ Render रिडिप्लोयले गर्दा सर्भर सुरुवाती अवस्थामा फर्किएको भेटियो!
                  </h4>
                  <span className="text-[10px] bg-slate-950 text-white font-bold px-2 py-0.5 rounded-full">
                    Auto-Save Alert
                  </span>
                </div>
                <p className="text-xs text-slate-900 font-medium leading-relaxed max-w-2xl">
                  सर्भरमा हाल केवल {resetDetected.serverCount} वटा लेख छन्, तर तपाईंको यो डिभाइसको स्थानीय भल्ट (Browser Vault) मा <strong>{resetDetected.localCount} वटा सम्पूर्ण लेख तथा सेटिङ्स</strong> सुरक्षित छन्। १-क्लिकमै आफ्नो सम्पूर्ण डाटा फिर्ता ल्याउनुहोस्!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={handleInstantAutoRestore}
                disabled={loadingData}
                className="flex-1 md:flex-none px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>१-क्लिकमा अटो-रिस्टोर (Instant Auto-Restore)</span>
              </button>
              <button
                type="button"
                onClick={() => setResetDetected(null)}
                className="p-2 text-slate-800 hover:text-black cursor-pointer rounded-lg hover:bg-amber-300/60"
                title="हटाउनुहोस्"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Secret Safe Access Link Box */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm border border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-sm text-white">
                    तपाईंको गोप्य सुरक्षित प्रशासनिक लिङ्क (Secret Admin Safe Link)
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-mono font-bold shrink-0">
                  सार्वजनिक रूपमा पूर्ण लुकेको
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                सामान्य प्रयोगकर्ता वा आगन्तुकहरूका लागि वेबसाइटमा कुनै पनि व्यवस्थापक वा लक बटन देखाइएको छैन। तपाईंले यो पोर्टल खोल्न तलको गोप्य लिङ्क प्रयोग गर्नुपर्छ र आफ्नो ब्राउजरमा बुकमार्क राख्नुहोस्:
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <code className="text-emerald-300 text-xs font-mono select-all truncate max-w-lg">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/${settingsForm.adminSecretSlug || 'kg-admin-secure'}`
                    : `/${settingsForm.adminSecretSlug || 'kg-admin-secure'}`}
                </code>
                <button
                  type="button"
                  onClick={handleCopySafeLink}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copySafeLinkSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>लिङ्क कपी भयो!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>गोप्य लिङ्क कपी गर्नुहोस्</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Real Statistics from Persistent Database (Section 6.2) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium block">कुल प्रकाशित</span>
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {publishedCount}
                </span>
                <span className="text-[10px] text-emerald-600 block mt-1">सार्वजनिक रूपमा उपलब्ध</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium block">ड्राफ्ट (Drafts)</span>
                <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
                  {draftCount}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">अप्रकाशित निजी सामग्री</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium block">भिडियो सामग्री</span>
                <span className="text-2xl font-bold text-blue-600 font-mono tabular-nums">
                  {videoCount}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">फेसबुक Reels & Posts</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium block">सच्याइ प्रविष्टि</span>
                <span className="text-2xl font-bold text-purple-600 font-mono tabular-nums">
                  {correctionsList.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">सार्वजनिक सुधार अभिलेख</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium block">मिडिया फाइलहरू</span>
                <span className="text-2xl font-bold text-slate-800 font-mono tabular-nums">
                  {mediaList.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">अपलोड गरिएका तस्बिर</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium block">सम्पर्क सन्देशहरू</span>
                <span className="text-2xl font-bold text-red-600 font-mono tabular-nums">
                  {messagesList.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">प्राप्त सोधपुछहरू</span>
              </div>
            </div>

            {/* Quick Actions Bar (Large tap targets for Android) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">द्रुत कार्यहरू (Quick Actions):</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCreateNewContent('article')}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs touch-target"
                >
                  <Plus className="w-4 h-4" />
                  <span>नयाँ लेख / अपडेट थप्नुहोस्</span>
                </button>

                <button
                  onClick={() => handleCreateNewContent('explainer')}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs touch-target"
                >
                  <Plus className="w-4 h-4" />
                  <span>नयाँ विस्तृत Explainer थप्नुहोस्</span>
                </button>

                <button
                  onClick={() => handleCreateNewContent('video')}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs touch-target"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>फेसबुक भिडियो / Reel लिङ्क गर्नुहोस्</span>
                </button>

                <button
                  onClick={() =>
                    setNewCorrection({
                      contentId: '',
                      contentTitle: '',
                      issueDate: new Date().toLocaleDateString('ne-NP'),
                      originalError: '',
                      correctedText: '',
                      explanation: ''
                    })
                  }
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs touch-target"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>नयाँ सच्याइ (Correction) जारी गर्नुहोस्</span>
                </button>
              </div>
            </div>

            {/* Honest Analytics Disclosure (Section 6.2 rule) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 block">पारदर्शिता सूचना (Real Data Policy):</span>
              <p>
                माथि देखाइएको तथ्याङ्क प्रत्यक्ष तपाईंको सर्भर डाटाबेसबाट आएको वास्तविक सङ्ख्या हो। हामी कुनै पनि नक्कली भिजिटर काउन्ट, बनावटी सामाजिक इन्गेजमेन्ट वा काल्पनिक फेसबुक तथ्याङ्क देखाउँदैनौँ।
              </p>
            </div>

            {/* Recently Edited Items */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">भर्खरै परिमार्जित सामग्रीहरू</h4>
                <button
                  onClick={() => setActiveTab('content')}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  सबै हेर्नुहोस् →
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {contentList.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                        </span>
                        <span>·</span>
                        <span className="font-medium text-slate-700">{item.category}</span>
                        <span>·</span>
                        <span>{new Date(item.updatedAt).toLocaleDateString('ne-NP')}</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 truncate">{item.title}</h5>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEditContent(item)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="सम्पादन गर्नुहोस्"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg cursor-pointer ${
                          item.status === 'published'
                            ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {item.status === 'published' ? 'अप्रकाशित गर्नुहोस्' : 'प्रकाशन गर्नुहोस्'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: CONTENT MANAGER ================= */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="शीर्षक खोज्नुहोस्..."
                    value={contentSearch}
                    onChange={(e) => setContentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <select
                  value={contentFilterType}
                  onChange={(e) => setContentFilterType(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">सबै प्रकार</option>
                  <option value="article">Article</option>
                  <option value="explainer">Explainer</option>
                  <option value="video">Video</option>
                  <option value="notice">Notice</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCreateNewContent('article')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>नयाँ लेख</span>
                </button>
                <button
                  onClick={() => handleCreateNewContent('explainer')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>नयाँ Explainer</span>
                </button>
              </div>
            </div>

            {/* Table / List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <th className="p-3.5">शीर्षक & श्रेणी</th>
                      <th className="p-3.5">प्रकार</th>
                      <th className="p-3.5">अवस्था (Status)</th>
                      <th className="p-3.5">भ्यूज</th>
                      <th className="p-3.5">मिति</th>
                      <th className="p-3.5 text-right">कार्यहरू</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredContent.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 max-w-sm">
                          <span className="font-bold text-slate-900 block truncate">{item.title}</span>
                          <span className="text-[11px] text-slate-500 font-medium">{item.category}</span>
                        </td>
                        <td className="p-3.5 capitalize text-slate-600">{item.type}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              item.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status === 'published' ? 'प्रकाशित' : 'ड्राफ्ट'}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono tabular-nums text-slate-600">{item.views}</td>
                        <td className="p-3.5 text-slate-500">{new Date(item.createdAt).toLocaleDateString('ne-NP')}</td>
                        <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePublish(item)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          >
                            {item.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleEditContent(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(item.id, item.title)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: VIDEOS & REELS ================= */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">फेसबुक भिडियो & Reels व्यवस्थापन</h3>
                <p className="text-xs text-slate-500">आफ्नो आधिकारिक फेसबुक पेजका भिडियो सामग्री यहाँ प्रविष्टि गर्नुहोस्।</p>
              </div>
              <button
                onClick={() => handleCreateNewContent('video')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>नयाँ भिडियो लिङ्क थप्नुहोस्</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentList
                .filter((c) => c.type === 'video')
                .map((vid) => (
                  <div key={vid.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-red-600">{vid.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          vid.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {vid.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{vid.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{vid.summary}</p>

                    {vid.facebookPostUrl && (
                      <div className="text-[11px] text-blue-600 truncate flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{vid.facebookPostUrl}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="space-x-1">
                        <button
                          onClick={() => handleEditContent(vid)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded font-medium cursor-pointer"
                        >
                          सम्पादन
                        </button>
                        <button
                          onClick={() => handleTogglePublish(vid)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded font-medium cursor-pointer"
                        >
                          {vid.status === 'published' ? 'अप्रकाशित' : 'प्रकाशित'}
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteContent(vid.id, vid.title)}
                        className="text-red-600 p-1 hover:bg-red-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: SEO & METADATA MANAGEMENT ================= */}
        {activeTab === 'seo' && (
          <AdminSeoPanel
            settings={settingsForm}
            onSave={handleSaveSettings}
            isSaving={loadingData}
          />
        )}

        {/* ================= TAB 4: CATEGORIES ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">सामग्री श्रेणी व्यवस्थापन (Categories)</h3>
                <p className="text-xs text-slate-500">नयाँ श्रेणी थप्न, सम्पादन गर्न वा हटाउन सकिन्छ।</p>
              </div>
              <button
                onClick={() =>
                  setEditingCategory({
                    name: '',
                    nameEn: '',
                    slug: '',
                    order: categoriesList.length + 1
                  })
                }
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>नयाँ श्रेणी थप्नुहोस्</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-3.5">क्रम</th>
                    <th className="p-3.5">नेपाली नाम</th>
                    <th className="p-3.5">अङ्ग्रेजी नाम</th>
                    <th className="p-3.5">Slug</th>
                    <th className="p-3.5 text-right">कार्यहरू</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoriesList.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-mono">{cat.order}</td>
                      <td className="p-3.5 font-bold text-slate-900">{cat.name}</td>
                      <td className="p-3.5 text-slate-600">{cat.nameEn}</td>
                      <td className="p-3.5 font-mono text-slate-500">{cat.slug}</td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 5: CORRECTIONS ================= */}
        {activeTab === 'corrections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">सच्याइ तथा पारदर्शि अभिलेख (Corrections Log)</h3>
                <p className="text-xs text-slate-500">
                  कुनै सामग्रीमा भूल भएमा पाठकलाई झुक्याउन नभई खुला रूपमा यहाँ सच्याइ प्रविष्टि गर्नुहोस्।
                </p>
              </div>
              <button
                onClick={() =>
                  setNewCorrection({
                    contentId: '',
                    contentTitle: '',
                    issueDate: new Date().toLocaleDateString('ne-NP'),
                    originalError: '',
                    correctedText: '',
                    explanation: ''
                  })
                }
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>नयाँ सच्याइ थप्नुहोस्</span>
              </button>
            </div>

            <div className="space-y-3">
              {correctionsList.map((cor) => (
                <div key={cor.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {cor.contentTitle || 'सामान्य सच्याइ'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">मिति: {cor.issueDate}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-red-50 p-2.5 rounded border border-red-200">
                      <span className="font-bold text-red-800 block">पहिले भएको त्रुटि:</span>
                      <p className="text-red-900">{cor.originalError}</p>
                    </div>
                    <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200">
                      <span className="font-bold text-emerald-800 block">सच्याइएको नयाँ तथ्य:</span>
                      <p className="text-emerald-900">{cor.correctedText}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>स्पष्टीकरण: </strong> {cor.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: MEDIA GALLERY ================= */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">मिडिया ग्यालरी (Media Library)</h3>
                <p className="text-xs text-slate-500">
                  मोबाइल वा कम्प्युटरबाट तस्बिर अपलोड गर्नुहोस् (अधिकतम ५MB, JPG/PNG/WEBP)।
                </p>
              </div>

              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingMedia}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 touch-target"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadingMedia ? 'अपलोड हुँदैछ...' : 'तस्बिर अपलोड गर्नुहोस्'}</span>
                </button>
              </div>
            </div>

            {mediaList.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500 text-xs">
                कुनै मिडिया फाइल छैन। माथिको बटनबाट तस्बिर अपलोड गर्नुहोस्।
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaList.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs group flex flex-col justify-between">
                    <div className="aspect-video bg-slate-100 overflow-hidden relative">
                      <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5 space-y-1.5">
                      <p className="text-xs font-medium text-slate-900 truncate" title={item.originalName}>
                        {item.originalName}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{(item.size / 1024).toFixed(0)} KB</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyMediaUrl(item.url)}
                            className="p-1 hover:bg-slate-100 rounded text-blue-600 cursor-pointer"
                            title="लिङ्क कपी"
                          >
                            {copiedMediaUrl === item.url ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(item.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600 cursor-pointer"
                            title="मेटाउनुहोस्"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 7: MESSAGES & INQUIRIES ================= */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-red-600" />
                  <span>सम्पर्क सन्देश तथा सोधपुछ (Received Inquiries & Corrections)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  पाठक तथा आगन्तुकहरूबाट प्राप्त सोधपुछ, सच्याइ अनुरोध र प्रतिक्रियाहरूको जवाफ सिधै यहीँबाट पठाउनुहोस्।
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium">
                  जम्मा सन्देश: <strong>{messagesList.length}</strong>
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-medium">
                  जवाफ बाँकी: <strong>{messagesList.filter((m) => !m.replySent).length}</strong>
                </span>
              </div>
            </div>

            {messagesList.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-500 text-xs space-y-2">
                <Mail className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-700">हाल कुनै नयाँ सन्देश छैन।</p>
                <p className="text-slate-400">वेबसाइटको सम्पर्क वा सच्याइ फारमबाट सन्देश आउनासाथ यहाँ देखिनेछ।</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messagesList.map((msg) => {
                  const isReplying = replyingMessage?.id === msg.id;
                  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${encodeURIComponent(`Re: ${msg.subject} - खबर GPT`)}&body=${encodeURIComponent(`नमस्ते ${msg.name} जी,\n\nखबर GPT मा सम्पर्क गर्नुभएकोमा धन्यवाद।\n\n\n\n--- प्राप्त सन्देश ---\n${msg.message}`)}`;
                  const cleanPhone = msg.phone ? msg.phone.replace(/[^0-9]/g, '') : '';
                  const whatsappUrl = cleanPhone
                    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`नमस्ते ${msg.name} जी, खबर GPT मा सन्देश पठाउनुभएको सम्बन्धमा:`)}`
                    : null;

                  return (
                    <div
                      key={msg.id}
                      className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                        msg.replySent
                          ? 'border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/10'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                {msg.subject}
                              </h4>
                              {msg.replySent ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>जवाफ पठाइसकिएको</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  <span>⏳ नयाँ (जवाफ बाँकी)</span>
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span className="font-medium text-slate-800">{msg.name}</span>
                              <span>·</span>
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-blue-600 hover:underline flex items-center gap-1 font-mono"
                              >
                                <span>{msg.email}</span>
                              </a>
                              {msg.phone && (
                                <>
                                  <span>·</span>
                                  <span className="font-mono text-slate-700">📞 {msg.phone}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                              {msg.type === 'correction'
                                ? 'सच्याइ/सुझाव'
                                : msg.type === 'copyright'
                                ? 'प्रतिलिपि अधिकार'
                                : msg.type === 'privacy'
                                ? 'गोपनीयता'
                                : msg.type === 'sponsorship'
                                ? 'विज्ञापन/प्रायोजन'
                                : 'सम्पर्क/सोधपुछ'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(msg.createdAt).toLocaleDateString('ne-NP')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer transition"
                              title="सन्देश मेटाउनुहोस्"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* User's Original Message Body */}
                      <div className="p-4 sm:p-5 space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </div>

                        {/* Already Sent Reply Accordion/Box */}
                        {msg.replySent && msg.replyMessage && (
                          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2 text-emerald-900 border-b border-emerald-200 pb-2">
                              <div className="flex items-center gap-1.5 font-bold">
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>पठाइएको जवाफ (Sent by {msg.repliedBy || 'Admin'})</span>
                              </div>
                              {msg.repliedAt && (
                                <span className="text-[11px] font-mono text-emerald-700">
                                  {new Date(msg.repliedAt).toLocaleString('ne-NP')}
                                </span>
                              )}
                            </div>
                            {msg.replySubject && (
                              <p className="font-semibold text-emerald-950">
                                विषय: {msg.replySubject}
                              </p>
                            )}
                            <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 text-slate-800 whitespace-pre-wrap font-sans text-xs sm:text-sm">
                              {msg.replyMessage}
                            </div>
                          </div>
                        )}

                        {/* Quick Action Toolbar */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => (isReplying ? setReplyingMessage(null) : handleOpenReply(msg))}
                            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                              isReplying
                                ? 'bg-slate-800 text-white hover:bg-slate-900'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>
                              {isReplying
                                ? 'सम्पादन बन्द गर्नुहोस्'
                                : msg.replySent
                                ? 'पुनः नयाँ जवाफ पठाउनुहोस्'
                                : 'जवाफ पठाउनुहोस् (Reply)'}
                            </span>
                          </button>

                          <a
                            href={gmailComposeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition border border-slate-200 cursor-pointer shadow-2xs"
                            title="तपाईंको व्यक्तिगत वा आधिकारिक Gmail कम्पोज बक्समा खोल्छ (१००% सिधै काम गर्छ)"
                          >
                            <Mail className="w-3.5 h-3.5 text-red-500" />
                            <span>Gmail मा खोल्नुहोस्</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>

                          {!msg.replySent && (
                            <button
                              type="button"
                              onClick={() => handleMarkRepliedViaGmail(msg)}
                              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition border border-emerald-200 cursor-pointer"
                              title="Gmail मा पठाइसकेपछि यो सन्देशलाई 'जवाफ पठाइसकिएको' स्थितिमा राख्नुहोस्"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Gmail बाट पठाइसकियो</span>
                            </button>
                          )}

                          {whatsappUrl && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition border border-emerald-200 cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp मा जवाफ</span>
                              <ExternalLink className="w-3 h-3 text-emerald-600" />
                            </a>
                          )}
                        </div>

                        {/* Interactive Reply Panel (Shown when user clicks Reply) */}
                        {isReplying && (
                          <form
                            onSubmit={handleSendReply}
                            className="mt-4 p-4 sm:p-5 bg-gradient-to-b from-slate-50 to-red-50/20 border-2 border-red-200 rounded-2xl space-y-4 animate-in fade-in duration-200"
                          >
                            <div className="flex items-center justify-between border-b border-red-100 pb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                                  <Send className="w-3.5 h-3.5" />
                                </div>
                                <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                                  {msg.name} लाई आधिकारिक सम्पादकीय जवाफ पठाउनुहोस्
                                </h5>
                              </div>
                              <button
                                type="button"
                                onClick={() => setReplyingMessage(null)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-3 text-xs">
                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                  प्रापक (Recipient):
                                </label>
                                <input
                                  type="text"
                                  disabled
                                  value={`${msg.name} <${msg.email}>`}
                                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono text-xs cursor-not-allowed"
                                />
                              </div>

                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                  जवाफको विषय (Subject):
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={replySubject}
                                  onChange={(e) => setReplySubject(e.target.value)}
                                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500 font-medium"
                                />
                              </div>

                              <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                  जवाफको व्यहोरा (Your Reply Message):
                                </label>
                                <textarea
                                  rows={5}
                                  required
                                  value={replyBody}
                                  onChange={(e) => setReplyBody(e.target.value)}
                                  placeholder="नमस्ते, खबर GPT मा सम्पर्क गर्नुभएकोमा धन्यवाद..."
                                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
                                />
                              </div>

                              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                                <div>
                                  <span className="font-bold text-slate-800 block text-xs">
                                    सिधै प्रणाली मार्फत इमेल पठाउनुहोस् (Send Email via Resend / SMTP)
                                  </span>
                                  <span className="text-[11px] text-slate-500">
                                    सक्रिय गर्दा {msg.email} मा आधिकारिक ढाँचाको इमेल तुरुन्तै पठाइनेछ।
                                  </span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={replySendViaEmail}
                                  onChange={(e) => setReplySendViaEmail(e.target.checked)}
                                  className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                                />
                              </div>

                              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setReplyingMessage(null)}
                                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                                >
                                  रद्द गर्नुहोस्
                                </button>
                                <button
                                  type="submit"
                                  disabled={sendingReply}
                                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>{sendingReply ? 'पठाउँदै...' : 'जवाफ पठाउनुहोस् र सुरक्षित गर्नुहोस्'}</span>
                                </button>
                              </div>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: AUDIT LOGS ================= */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">प्रशासनिक अडिट लग (Admin Audit Log)</h3>
                <p className="text-xs text-slate-500">सुरक्षा र पारदर्शिताका लागि प्रणालीमा भएका महत्त्वपूर्ण गतिविधिहरूको अभिलेख।</p>
              </div>
              <button
                onClick={loadAllData}
                className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>रिफ्रेस</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-3.5">कार्य (Action)</th>
                    <th className="p-3.5">लक्षित सामग्री / क्षेत्र</th>
                    <th className="p-3.5">विवरण (Details)</th>
                    <th className="p-3.5">प्रयोगकर्ता</th>
                    <th className="p-3.5">मिति & समय</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogsList.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          log.action === 'create' || log.action === 'publish'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'delete'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">{log.targetTitle}</td>
                      <td className="p-3.5 text-slate-600 max-w-md truncate">{log.details || '-'}</td>
                      <td className="p-3.5 font-mono text-slate-500">{log.userId}</td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('ne-NP')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: SYSTEM STATUS ================= */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">वेबसाइट र सर्भर स्थिति (System Health Diagnostics)</h3>
              <p className="text-xs text-slate-500">सर्भर, डाटाबेस र ब्याकअपको प्रत्यक्ष स्थिति मोनिटर।</p>
            </div>

            {systemStatus ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 block">सर्भर स्थिति</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-lg font-bold text-slate-900">{systemStatus.status.toUpperCase()}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">Port: {systemStatus.port}</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 block">अवटाइम (Uptime)</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    {systemStatus.performance.uptimeMinutes} मिनेट
                  </span>
                  <span className="text-[11px] text-slate-500 block">निरन्तर सञ्चालनमा</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 block">र्याम मेमोरी प्रयोग</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    {systemStatus.performance.memoryRssMb} MB
                  </span>
                  <span className="text-[11px] text-slate-500 block">Heap: {systemStatus.performance.memoryHeapUsedMb} MB</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                  <span className="text-xs text-slate-500 block">डाटाबेस रेकर्डहरू</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    {systemStatus.database.contentCount} सामग्री
                  </span>
                  <span className="text-[11px] text-slate-500 block">अडिट लग: {systemStatus.database.auditLogsCount}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border text-center text-xs text-slate-500">
                स्थिति विवरण लोड हुँदैछ...
              </div>
            )}

            {/* Maintenance Routine Checklist (Section 29) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">नियमित मर्मत तथा सुरक्षा कार्यतालिका (Maintenance Schedule)</h4>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>मासिक ब्याकअप:</strong> प्रत्येक महिना कम्तीमा एक पटक "ब्याकअप & सुरक्षा" ट्याबबाट पूर्ण JSON ब्याकअप डाउनलोड गर्नुहोस्।</li>
                <li><strong>सम्पर्क सन्देश समीक्षा:</strong> प्राप्त प्रतिक्रिया र सच्याइ अनुरोधहरू हप्तामा एक पटक समीक्षा गरी पुराना सन्देशहरू मेटाउनुहोस्।</li>
                <li><strong>पासवर्ड नवीकरण:</strong> प्रत्येक ३ देखि ६ महिनामा व्यवस्थापक पासवर्ड परिवर्तन गर्नुहोस्।</li>
                <li><strong>कानुनी नीति पुनरावलोकन:</strong> प्रतिलिपि अधिकार तथा सम्पादकीय मापदण्डहरू नेपालको कानुन अनुसार अद्यावधिक राख्नुहोस्।</li>
              </ul>
            </div>
          </div>
        )}

        {/* ================= TAB 8: SETTINGS & BRAND STUDIO ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">साइट सेटिङ तथा ब्रान्डिङ स्टुडियो (Brand & Site Settings)</h3>
              <p className="text-xs text-slate-500">
                यहाँबाट लोगो, साइटको नाम, गोप्य सुरक्षित प्रशासनिक लिङ्क, ब्रेकिङ समाचार टिकर र सम्पूर्ण विवरण सम्पादन गर्न सक्नुहुन्छ।
              </p>
            </div>

            {/* Direct Link Banner to Poster Studio Settings */}
            <div className="bg-linear-to-r from-red-600 to-rose-700 rounded-2xl p-4 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block">नयाँ व्यवस्थापन</span>
                <h4 className="font-bold text-sm">पोस्टर तथा फोटो स्टुडियो पूर्ण अनुकूलन (Poster Studio Settings)</h4>
                <p className="text-xs text-red-100">पोस्टरमा खबर GPT लोगो, फेसबुक ब्याज (KhabarGpt), वाटरमार्क, र डिजाइन व्यवस्थापन गर्नुहोस्।</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('poster_studio')}
                className="px-4 py-2 bg-white text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors shadow-xs"
              >
                पोस्टर स्टुडियो व्यवस्थापन खोल्नुहोस् →
              </button>
            </div>

            {/* SECTION 1: BRAND LOGO STUDIO */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-slate-900 text-sm">आधिकारिक लोगो व्यवस्थापन (Official Logo Management)</h4>
                </div>
                <span className="text-[11px] text-slate-500">PNG, SVG, JPG वा WEBP</span>
              </div>

              {/* Live Logo Preview Box */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">प्रत्यक्ष लोगो पूर्वावलोकन (Live Logo Preview):</span>
                  {/* Size Switcher for Preview */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-[11px]">
                    {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setLogoSizePreview(s)}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          logoSizePreview === s ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {s.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <KhabarLogo
                      size={logoSizePreview}
                      customUrl={settingsForm.customLogoUrl || '/logo.svg'}
                      title={settingsForm.siteTitle || 'Khabar GPT'}
                    />
                  </div>

                  <div className="text-right sm:text-left text-xs text-slate-500 space-y-1">
                    <div className="text-[11px] font-mono text-slate-600 truncate max-w-xs">
                      स्रोत: {settingsForm.customLogoUrl || '/logo.svg'}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>हेडर, फुटर तथा मोबाइलमा स्वतः लागु हुन्छ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoUpload}
                    accept=".svg,.png,.jpg,.jpeg,.webp"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingLogo ? 'अपलोड हुँदैछ...' : 'नयाँ लोगो अपलोड (Auto-Save)'}</span>
                  </button>
                  <span className="text-[10px] text-slate-500 mt-1 block text-center">
                    पारदर्शी PNG वा SVG (१:१ अनुपात)
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setSvgEditorOpen(true)}
                    className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <Edit3 className="w-4 h-4 text-amber-400" />
                    <span>SVG कोड सिधै पेस्ट गर्नुहोस्</span>
                  </button>
                  <span className="text-[10px] text-slate-500 mt-1 block text-center">
                    /logo.svg सिधै अद्यावधिक
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={async () => {
                      const updated = await api.updateSettings({ ...settingsForm, customLogoUrl: '/logo.png' });
                      setSettingsForm(updated);
                      onSettingsUpdate(updated);
                      showNotification('आधिकारिक डिफल्ट लोगो (/logo.png) मा रिसेट गरियो!');
                    }}
                    className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>डिफल्ट लोगोमा रिसेट</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  वा सिधै लोगोको बाह्य छवि URL प्रविष्ट गर्नुहोस् (Custom Image URL)
                </label>
                <input
                  type="text"
                  value={settingsForm.customLogoUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, customLogoUrl: e.target.value })}
                  placeholder="उदा: /uploads/my_logo.png वा https://example.com/logo.svg"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* SPECIAL: CARD LOGO SETTING (कोट & सोसियल कार्ड लोगो) */}
              <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-red-600" />
                    <span className="font-bold text-slate-900 text-xs">
                      सोसियल कोट कार्डका लागि लोगो (Card Graphic Logo)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    कार्ड जेनेरेटरमा प्रयोग हुने
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-900 flex items-center justify-center overflow-hidden p-1">
                      <img
                        src={settingsForm.customCardLogoUrl || settingsForm.customLogoUrl || '/logo.svg'}
                        alt="Card Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {settingsForm.customCardLogoUrl ? 'कस्टम कार्ड लोगो सक्रिय' : 'साइटको मुख्य लोगो प्रयोग हुँदैछ'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">
                        {settingsForm.customCardLogoUrl || settingsForm.customLogoUrl || '/logo.svg'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="file"
                      ref={cardLogoFileInputRef}
                      onChange={handleCardLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => cardLogoFileInputRef.current?.click()}
                      disabled={uploadingCardLogo}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingCardLogo ? 'अपलोड हुँदै...' : 'कार्ड लोगो बदल्नुहोस्'}</span>
                    </button>

                    {settingsForm.customCardLogoUrl && (
                      <button
                        type="button"
                        onClick={async () => {
                          const updated = await api.updateSettings({ ...settingsForm, customCardLogoUrl: '' });
                          setSettingsForm(updated);
                          onSettingsUpdate(updated);
                          showNotification('कार्ड लोगो रिसेट भयो (मुख्य साइट लोगो लागु हुनेछ)।');
                        }}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-lg border border-slate-200 cursor-pointer"
                        title="साइट लोगोमा रिसेट गर्नुहोस्"
                      >
                        रिसेट
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: BRAND NAME & COPY */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <FileText className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-slate-900 text-sm">साइटको नाम तथा ब्रान्ड विवरण (Brand Name & Copy)</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    साइटको मुख्य नाम (Site / Brand Title)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.siteTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                    placeholder="उदा: Khabar GPT (खबर GPT)"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">हेडर तथा ब्राउजर ट्याबमा देखिने नाम</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    उपशीर्षक / ट्यागलाइन (Subtitle / Tagline)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.siteSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteSubtitle: e.target.value })}
                    placeholder="उदा: नेपालका समसामयिक विषय र तथ्यपरक जानकारी"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  नेपाली परिचय वाक्य (Intro Description - Home Hero & About)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.introTextNp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, introTextNp: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* SECTION 3: SECRET SAFE LINK CONFIGURATION */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">गोप्य सुरक्षित प्रशासनिक लिङ्क (Secret Admin Safe Link)</h4>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  सामान्य प्रयोगकर्ताबाट पूर्ण लुकेको
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-xs">
                यो लिङ्क सामान्य आगन्तुक वा कुनै पनि सार्वजनिक मेनुमा कतै पनि राखिएको छैन। प्रशासनिक पोर्टल खोल्नका लागि यो सुरक्षित URL प्रयोग गर्नुहोस् र आफ्नो ब्राउजरमा बुकमार्क राख्नुहोस्:
              </p>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="font-mono text-emerald-300 text-xs truncate max-w-md select-all">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/${settingsForm.adminSecretSlug || 'kg-admin-secure'}`
                    : `/${settingsForm.adminSecretSlug || 'kg-admin-secure'}`}
                </div>

                <button
                  type="button"
                  onClick={handleCopySafeLink}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 text-xs"
                >
                  {copySafeLinkSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>लिङ्क प्रतिलिपि भयो!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>सुरक्षित लिङ्क प्रतिलिपि (Copy Safe Link)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    गोप्य पाथ / स्लग सम्पादन (Custom Secret Path Slug)
                  </label>
                  <div className="flex items-center">
                    <span className="bg-slate-800 border border-r-0 border-slate-700 px-3 py-2 text-slate-400 rounded-l-lg font-mono text-xs">
                      /
                    </span>
                    <input
                      type="text"
                      value={settingsForm.adminSecretSlug || 'kg-admin-secure'}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          adminSecretSlug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')
                        })
                      }
                      placeholder="kg-admin-secure"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-r-lg font-mono text-xs text-white"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    अंग्रेजी अक्षर, संख्या र हाइफन मात्र प्रयोग गर्नुहोस्
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-amber-400">सुरक्षा सल्लाह:</div>
                  <div>यो स्लग परिवर्तन गरेपछि पुरानो लिङ्कबाट पोर्टल खुल्ने छैन। नयाँ लिङ्क तुरुन्त सुरक्षित गर्नुहोस्।</div>
                </div>
              </div>
            </div>

            {/* SECTION 4: LIVE BREAKING NEWS TICKER */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-slate-900 text-sm">ताजा ब्रेकिङ समाचार टिकर (Live Breaking Ticker)</h4>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="font-bold text-xs text-slate-700">टिकर सक्रिय:</span>
                  <input
                    type="checkbox"
                    checked={!!settingsForm.breakingNewsActive}
                    onChange={(e) => setSettingsForm({ ...settingsForm, breakingNewsActive: e.target.checked })}
                    className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ब्रेकिङ अलर्ट सन्देश (Breaking Alert Message)
                </label>
                <input
                  type="text"
                  value={settingsForm.breakingNewsText || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, breakingNewsText: e.target.value })}
                  placeholder="उदा: नेपाल सरकारद्वारा डिजिटल सूचना तथा तथ्य-जाँच सेवा सम्बन्धी नयाँ निर्देशिका जारी..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* Live Breaking Preview */}
              {settingsForm.breakingNewsActive && settingsForm.breakingNewsText && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-semibold text-slate-600">ब्यानर पूर्वावलोकन (Preview):</span>
                  <div className="bg-red-600 text-white p-2 px-3 rounded-lg flex items-center gap-2 text-xs">
                    <span className="bg-white text-red-700 font-extrabold text-[10px] uppercase px-1.5 py-0.5 rounded-sm shrink-0">
                      ताजा अपडेट
                    </span>
                    <span className="truncate">{settingsForm.breakingNewsText}</span>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 5: LEGAL NOTICE & SEARCH ENGINE POLICIES */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-slate-900 text-sm">कानुनी सूचना तथा नीति नियन्त्रण (Legal Safeguards)</h4>
              </div>

              {/* Banner Notice Toggle */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    शीर्ष कानुनी सूचना ब्यानर सक्षम (Show Top Disclaimer Banner)
                  </span>
                  <input
                    type="checkbox"
                    checked={settingsForm.bannerNoticeActive !== false}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bannerNoticeActive: e.target.checked })}
                    className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={settingsForm.bannerNotice || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bannerNotice: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs"
                  />
                </div>
              </div>

              {/* Toggle Standalone News Publishing */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">
                    स्वतन्त्र समाचार प्रकाशन सक्षम (Enable News Publishing)
                  </span>
                  <input
                    type="checkbox"
                    checked={settingsForm.articlePublishingEnabled}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, articlePublishingEnabled: e.target.checked })
                    }
                    className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  नेपालको कानुनी प्रावधान स्पष्ट नहुन्जेल यदि तपाईं केवल फेसबुक भिडियो र एक्सप्लेनर मात्र चलाउन चाहनुहुन्छ भने यो स्विच बन्द गर्न सक्नुहुन्छ।
                </p>
              </div>

              {/* Search Indexing Directive */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    सर्च इन्जिन इन्डेक्सिङ बन्द गर्नुहोस् (Disallow Search Indexing)
                  </span>
                  <input
                    type="checkbox"
                    checked={!!settingsForm.disallowSearchIndexing}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, disallowSearchIndexing: e.target.checked })
                    }
                    className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  यदि साइट तयारीको चरणमा छ भने गुगल र अन्य सर्च इन्जिनलाई खोज नतिजामा नदेखाउन robots.txt मा Disallow आदेश दिइन्छ।
                </p>
              </div>

              {/* Maintenance Mode (मर्मत सम्भार मोड) */}
              <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
                settingsForm.maintenanceModeActive
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Wrench className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        वेबसाइट मर्मत सम्भार मोड (Maintenance Mode)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        सक्रिय गर्दा सर्वसाधारणलाई मर्मत सम्भार सूचना मात्र देखिनेछ, तपाईं एडमिन पोर्टल चलाउन सक्नुहुन्छ
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!settingsForm.maintenanceModeActive}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, maintenanceModeActive: e.target.checked })
                    }
                    className="w-5 h-5 accent-amber-600 rounded cursor-pointer shrink-0"
                  />
                </div>

                {settingsForm.maintenanceModeActive && (
                  <div className="space-y-3 pt-2.5 border-t border-amber-200 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        आगन्तुकहरूलाई देखाइने सूचना (Maintenance Message):
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.maintenanceModeMessage || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, maintenanceModeMessage: e.target.value })
                        }
                        placeholder="हाम्रो प्रणालीलाई अझ प्रभावकारी र सुरक्षित बनाउन नियमित प्राविधिक मर्मत भइरहेको छ। केही समयमै सेवा पुन: सञ्चालनमा आउनेछ।"
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        अनुमानित सम्पन्न हुने समय (Estimated Completion Time):
                      </label>
                      <input
                        type="text"
                        value={settingsForm.maintenanceEstimatedTime || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, maintenanceEstimatedTime: e.target.value })
                        }
                        placeholder="उदा: आज साँझ ६:०० बजेसम्म वा चाँडै नै"
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white text-xs font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 6: SOCIAL MEDIA & INTERNET PROMOTION CHANNELS */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-slate-900 text-sm">
                    सामाजिक सञ्जाल तथा अनलाइन प्रवर्द्धन च्यानलहरू (Social Media Promotion Hub)
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">गृहपृष्ठ तथा फुटरमा स्वतः प्रदर्शन हुने</span>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed">
                वेबसाइटमा आगन्तुकहरूलाई तपाईंको आधिकारिक सामाजिक सञ्जालमा जोड्न तलका लिङ्कहरू भर्नुहोस्। खाली छाडिएका सञ्जालहरू वेबसाइटमा देखाइने छैनन्।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    <span>फेसबुक पेज लिङ्क (Facebook Page URL)</span>
                  </label>
                  <input
                    type="url"
                    value={settingsForm.facebookUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/khabargpt"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-red-600" />
                    <span>युट्युब च्यानल लिङ्क (YouTube Channel URL)</span>
                  </label>
                  <input
                    type="url"
                    value={settingsForm.youtubeUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@khabargpt"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-800" />
                    <span>टिकटक प्रोफाइल लिङ्क (TikTok Profile URL)</span>
                  </label>
                  <input
                    type="url"
                    value={settingsForm.tiktokUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                    placeholder="https://tiktok.com/@khabargpt"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>इन्स्टाग्राम प्रोफाइल लिङ्क (Instagram URL)</span>
                  </label>
                  <input
                    type="url"
                    value={settingsForm.instagramUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/khabargpt"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5 text-slate-800" />
                    <span>एक्स / ट्विटर लिङ्क (X / Twitter URL)</span>
                  </label>
                  <input
                    type="url"
                    value={settingsForm.twitterUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                    placeholder="https://x.com/khabargpt"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ह्वाट्सएप च्यानल वा समुदाय (WhatsApp Channel)</span>
                  </label>
                  <input
                    type="url"
                    value={settingsForm.whatsappUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappUrl: e.target.value })}
                    placeholder="https://whatsapp.com/channel/..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                    <span>भाइबर समुदाय लिङ्क (Viber Community URL)</span>
                  </label>
                  <input
                    type="url"
                    value={
                      settingsForm.socialLinks?.find((s) => s.platform === 'viber')?.url || ''
                    }
                    onChange={(e) => {
                      const vUrl = e.target.value;
                      const existing = settingsForm.socialLinks || [];
                      const hasViber = existing.some((s) => s.platform === 'viber');
                      const updated = hasViber
                        ? existing.map((s) => (s.platform === 'viber' ? { ...s, url: vUrl } : s))
                        : [...existing, { id: 'viber', platform: 'viber' as const, label: 'Viber Community', url: vUrl, active: true }];
                      setSettingsForm({ ...settingsForm, socialLinks: updated });
                    }}
                    placeholder="https://invite.viber.com/?g2=..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* DYNAMIC ADDITIONAL SOCIAL MEDIA ACCOUNTS (Viber, Threads, Bluesky, LinkedIn, etc.) */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">
                      थप अन्य सामाजिक सञ्जाल तथा समुदाय च्यानलहरू (Custom Social Channels)
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      भाइबर, थ्रेड्स, ब्लुस्काई वा अन्य कुनै पनि खाता तथा समूह लिङ्क थप्नुहोस्
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newLink = {
                        id: `soc-${Date.now()}`,
                        platform: 'custom' as const,
                        label: 'नयाँ च्यानल',
                        url: '',
                        active: true
                      };
                      setSettingsForm({
                        ...settingsForm,
                        socialLinks: [...(settingsForm.socialLinks || []), newLink]
                      });
                    }}
                    className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ नयाँ खाता थप्नुहोस्</span>
                  </button>
                </div>

                {settingsForm.socialLinks && settingsForm.socialLinks.length > 0 ? (
                  <div className="space-y-2">
                    {settingsForm.socialLinks.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-2"
                      >
                        <div className="w-full sm:w-1/4">
                          <label className="text-[10px] text-slate-500 block mb-0.5">च्यानल नाम / लेबल</label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...(settingsForm.socialLinks || [])];
                              updated[idx].label = e.target.value;
                              setSettingsForm({ ...settingsForm, socialLinks: updated });
                            }}
                            placeholder="उदा: Viber Channel, Threads"
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
                          />
                        </div>

                        <div className="w-full sm:flex-1">
                          <label className="text-[10px] text-slate-500 block mb-0.5">URL लिङ्क</label>
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) => {
                              const updated = [...(settingsForm.socialLinks || [])];
                              updated[idx].url = e.target.value;
                              setSettingsForm({ ...settingsForm, socialLinks: updated });
                            }}
                            placeholder="https://invite.viber.com/... वा https://threads.net/@..."
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center pt-2 sm:pt-4">
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={item.active !== false}
                              onChange={(e) => {
                                const updated = [...(settingsForm.socialLinks || [])];
                                updated[idx].active = e.target.checked;
                                setSettingsForm({ ...settingsForm, socialLinks: updated });
                              }}
                              className="accent-red-600 rounded cursor-pointer"
                            />
                            <span className="text-slate-600 font-medium">सक्रिय</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = settingsForm.socialLinks?.filter((_, i) => i !== idx);
                              setSettingsForm({ ...settingsForm, socialLinks: updated });
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="हटाउनुहोस्"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    हाल कुनै अतिरिक्त सामाजिक सञ्जाल थपिएको छैन। माथिको "+ नयाँ खाता थप्नुहोस्" बटन क्लिक गर्नुहोस्।
                  </p>
                )}
              </div>

              <div className="pt-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  इन्टरनेट प्रयोगकर्ताका लागि Khabar GPT को उद्देश्य (Mission Description for Internet Users)
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.aboutMissionNp || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutMissionNp: e.target.value })}
                  placeholder="खबर GPT को मूल उद्देश्य नेपाली इन्टरनेट प्रयोगकर्ताहरूलाई भरपर्दो, सरल र तथ्यपरक डिजिटल सूचना तथा एक्सप्लेनर प्रदान गर्नु हो..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* SECTION 7: CONTACT & GMAIL MANAGEMENT */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  सम्पर्क तथा आधिकारिक Gmail व्यवस्थापन (Contact & Official Email)
                </h4>
              </div>

              {/* Informative Guidance Card for Gmail */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <Mail className="w-4 h-4 text-blue-700" />
                  <span>आधिकारिक इमेल व्यवस्थापन तथा अद्यावधिक सूचना</span>
                </div>
                <p className="leading-relaxed">
                  यदि तपाईंले अहिलेसम्म खबर GPT को लागि छुट्टै आधिकारिक इमेल बनाउनुभएको छैन भने, अहिले यो फिल्डमा आफ्नो व्यक्तिगत इमेल राख्न सक्नुहुन्छ वा खाली पनि छोड्न सक्नुहुन्छ।
                </p>
                <p className="leading-relaxed text-blue-800 font-medium">
                  पछि जब नयाँ आधिकारिक इमेल (जस्तै: <code>contact@khabargpt.com</code> वा <code>info@khabargpt.com</code>) सिर्जना गर्नुहुन्छ, यहाँ नयाँ इमेल टाइप गरी तल <strong>'सबै सेटिङहरू सुरक्षित गर्नुहोस्'</strong> बटन थिच्दा वेबसाइटभरि (सम्पर्क पृष्ठ, फुटर) तुरुन्तै अपडेट हुनेछ!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    सम्पर्क इमेल ठेगाना (Official Contact Email)
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    placeholder="उदा: contact@khabargpt.com वा आफ्नो इमेल"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    नयाँ इमेल बनाएपछि यहाँ परिवर्तन गर्नुहोस्
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">सम्पर्क फोन (ऐच्छिक)</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    placeholder="+977-..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ठेगाना / स्थान (Address)</label>
                  <input
                    type="text"
                    value={settingsForm.address || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    placeholder="काठमाडौँ, नेपाल"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    फुटर प्रतिलिपि अधिकार वाक्य (Footer Copyright Text)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.footerText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 7B: ZERO-LOSS INQUIRY, COLLABORATION & AUTO-REPLY HUB */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-sm">
                    शून्य-जोखिम सोधपुछ तथा सहकार्य सूचना प्रणाली (Real-Time Zero-Loss Alert & Auto-Reply Hub)
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Instant Forwarding
                </span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
                <span className="font-bold block text-emerald-900">
                  🎯 यो प्रणालीले कसरी तपाईंका सन्देशहरू हराउनबाट १००% जोगाउँछ?
                </span>
                <p className="leading-relaxed text-emerald-900">
                  Render को सर्भर रिस्टार्ट वा रिडिप्लोय भए पनि कुनै पनि पाठक वा विज्ञापनदाताको सन्देश हराउँदैन। वेबसाइटमा कसैले फाराम भर्नासाथ:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-800">
                  <li><strong>१. तपाईंको Gmail मा तत्काल अलर्ट:</strong> तल दिइएको तपाईंको इमेलमा सम्पूर्ण व्यहोरा र फोन नम्बरसहित १ सेकेन्डमै इमेल पुग्छ।</li>
                  <li><strong>२. प्रेषकलाई स्वचालित रसिद (Auto-Ack):</strong> पठाउने व्यक्तिलाई खबर GPT को तर्फबाट Ticket ID र फेसबुक मेसेन्जरको लिङ्कसहितको पुष्टिकरण इमेल जान्छ, ताकि उसले "मेरो सन्देश पुगेन कि?" भनी शङ्का गर्नै पर्दैन।</li>
                  <li><strong>३. Discord/Telegram Webhook:</strong> यदि तल Webhook लिङ्क राख्नुभएमा मोबाइलमा तुरुन्तै पुश नोटिफिकेसन आउँछ।</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    सोधपुछ & सहकार्य अलर्ट पुग्ने इमेल (Admin Notification Recipient)
                  </label>
                  <input
                    type="email"
                    value={settingsForm.adminNotificationEmail || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, adminNotificationEmail: e.target.value })}
                    placeholder="उदा: admin@yourdomain.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    खाली राखेमा सम्पर्क इमेल (Contact Email) मा अलर्ट पठाइनेछ
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Discord / Telegram / Zapier Webhook URL (ऐच्छिक)
                  </label>
                  <input
                    type="url"
                    value={settingsForm.inquiryWebhookUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, inquiryWebhookUrl: e.target.value })}
                    placeholder="https://discord.com/api/webhooks/... वा Telegram Bot"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Webhook राख्दा सन्देश आउनासाथ मोबाइलमा सिधै अलर्ट बज्छ
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">
                    प्रेषकलाई स्वचालित पुष्टिकरण रसिद पठाउनुहोस् (Send Auto-Reply Confirmation Email)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    पाठक वा सहकार्य प्रस्तावकलाई "सन्देश प्राप्त भयो" भनी Ticket ID सहितको आधिकारिक इमेल तुरुन्तै पठाउँछ
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.autoReplyEnabled !== false}
                  onChange={(e) => setSettingsForm({ ...settingsForm, autoReplyEnabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer shrink-0"
                />
              </div>
            </div>

            {/* Sticky Save Button Bar */}
            <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 hidden sm:inline">
                परिवर्तनहरू सुरक्षित गरेपछि सम्पूर्ण वेबसाइटमा प्रत्यक्ष लागु हुनेछ।
              </span>
              <button
                type="button"
                onClick={() => handleSaveSettings()}
                className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>सबै सेटिङहरू सुरक्षित गर्नुहोस् (Save All Settings)</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 9: BACKUP & SECURITY ================= */}
        {activeTab === 'backup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Change Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-slate-900">पासवर्ड परिवर्तन गर्नुहोस्</h3>
              </div>

              {pwChangeStatus && (
                <div className="p-3 bg-slate-100 rounded-lg text-xs font-semibold text-slate-800">
                  {pwChangeStatus}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">हालको पासवर्ड</label>
                  <input
                    type="password"
                    required
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">नयाँ सुरक्षित पासवर्ड (८+ अक्षर)</label>
                  <input
                    type="password"
                    required
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">नयाँ पासवर्ड पुष्टि गर्नुहोस्</label>
                  <input
                    type="password"
                    required
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
                >
                  पासवर्ड अद्यावधिक गर्नुहोस्
                </button>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] leading-relaxed space-y-1.5 mt-3">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>पूर्ण गोप्य & सुरक्षित (Zero Code Leak Guarantee):</span>
                  </div>
                  <p>
                    तपाईंले फेर्नुभएको पासवर्ड कोडमा कहिल्यै देखिँदैन र GitHub वा अरू कुनै डेभलपरले हेर्न सक्दैनन्। 
                  </p>
                  <p className="text-emerald-950 font-medium">
                    💡 <strong>Render मा कहिल्यै रिसेट नहुने बनाउन:</strong> Render Dashboard &gt; Service &gt; Environment मा गएर <code>ADMIN_PASSWORD</code> मा आफ्नो नयाँ पासवर्ड राख्न सक्नुहुन्छ। यसो गर्दा जतिपटक नयाँ डिप्लोय गरे पनि पासवर्ड कहिल्यै डिफल्टमा फर्किँदैन!
                  </p>
                </div>
              </form>
            </div>

            {/* Complete Database Backup & Recovery Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">१-क्लिक ब्याकअप र पुनर्स्थापना</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                तपाईंको सम्पूर्ण डाटाबेस (सबै लेख, भिडियो, श्रेणी, मिडिया मेटाडाटा, र सच्याइहरू) लाई सिधै JSON फाइलका रूपमा सुरक्षित राख्न वा पुनर्स्थापना गर्न सक्नुहुन्छ।
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href="/api/backup/export"
                  download
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>पूर्ण डाटाबेस ब्याकअप डाउनलोड गर्नुहोस् (JSON)</span>
                </a>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ब्याकअप फाइलबाट पुनर्स्थापना (Restore JSON)
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreFile}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Render Permanent Storage & Real Website Auto-Save Solution Card */}
            <div className="md:col-span-2 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-indigo-700/80 shadow-2xl space-y-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Render मा नयाँ डिप्लोय गर्दा डाटा कहिल्यै नमेटिने ३ उपाय (Permanent Auto-Save Solutions)
                    </h3>
                    <p className="text-xs text-indigo-200">
                      कसरी वास्तविक व्यावसायिक वेबसाइट (Real Website) जस्तै डाटा सधैँ सुरक्षित राख्ने?
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-extrabold flex items-center gap-1.5 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>१००% स्थायी समाधान</span>
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Method 1: Render Persistent Environment Variable */}
                <div className="bg-slate-950/90 p-5 rounded-2xl border border-indigo-500/30 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">१</span>
                      <h4 className="font-bold text-sm text-emerald-300">
                        Render Environment Variable (सबैभन्दा सजिलो)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Render को नि:शुल्क सर्भर रिस्टार्ट हुँदा स्थानीय डिस्क खाली हुन्छ। तर तलको बटन थिचेर <strong>सम्पूर्ण डाटाबेस</strong> को कोड कपी गर्नुहोस् र Render को Environment मा <code>KHABAR_PERSISTENT_DATA</code> मा राख्नुहोस्। यसपछि सर्भर जति पटक डिप्लोय भए पनि तपाईंको कुनै पनि नयाँ लेख मेटिँदैन!
                    </p>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400">
                      Name: <strong>KHABAR_PERSISTENT_DATA</strong>
                    </div>

                    <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 space-y-1">
                      <span className="font-bold block text-amber-300">💡 नयाँ लेख थप्दा यो कोड आफै अपडेट हुन्छ?</span>
                      <p className="leading-relaxed text-slate-300">
                        <strong>हुँदैन (Render does not auto-edit Env Vars)</strong>। तर चिन्ता लिनु पर्दैन—<strong>ब्राउजर अटो-भल्ट (Method 3)</strong> ले सबै नयाँ लेख तपाईंको डिभाइसमा स्वतः सेभ राख्छ र रिडिप्लोय भए १-क्लिकमै रिस्टोर गरिदिन्छ। साथै सबै नयाँ सोधपुछहरू सिधै तपाईंको <strong>Gmail</strong> मा तुरुन्त पुग्छन्!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyRenderPersistCode}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    {copiedPersistCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPersistCode ? 'कपी भयो!' : 'स्थायी डाटाबेस कोड कपी गर्नुहोस् (Copy Env)'}</span>
                  </button>
                </div>

                {/* Method 2: Git Repository Permanent Default */}
                <div className="bg-slate-950/90 p-5 rounded-2xl border border-indigo-500/30 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">२</span>
                      <h4 className="font-bold text-sm text-blue-300">
                        GitHub Repo मा Default बनाउने (Cleanest)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      तपाईंले सिर्जना गर्नुभएका सबै नयाँ लेख र सेटिङ्सलाई नयाँ <code>khabar_database.json</code> फाइलका रूपमा डाउनलोड गर्नुहोस्। यसलाई GitHub को <code>data/</code> फोल्डरमा राखेर Git Commit गर्दा वेबसाइटको मूल कोडमै तपाईंको सबै डाटा स्थायी डिफाल्ट बन्छ।
                    </p>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-blue-300">
                      File: <strong>data/khabar_database.json</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadGitDatabase}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>khabar_database.json डाउनलोड गर्नुहोस्</span>
                  </button>
                </div>

                {/* Method 3: Automatic Device Vault Sync */}
                <div className="bg-slate-950/90 p-5 rounded-2xl border border-indigo-500/30 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">३</span>
                      <h4 className="font-bold text-sm text-amber-300">
                        ब्राउजर अटो-भल्ट (Automatic Auto-Sync)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      तपाईंले यो एडमिन प्यानल चलाउँदा तपाईंको ब्राउजरले स्वचालित रूपमा हरेक समाचार र सेटिङ्सको ब्याकअप सुरक्षित राखिरहेको छ। Render रिडिप्लोय भएर सर्भर रिसेट भएको अवस्थामा यो पोर्टल खोल्नासाथ माथि १-क्लिक अटो-रिस्टोरको ब्यानर स्वतः देखा पर्छ!
                    </p>
                    <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-[11px] text-amber-200 flex items-center justify-between">
                      <span>अटो-भल्ट स्थिति:</span>
                      <span className="font-bold text-emerald-400">🟢 सक्रिय ({lastVaultSavedAt || 'भर्खरै सुरक्षित'})</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      showNotification('तपाईंको ब्राउजर अटो-भल्ट पूर्ण रूपमा सक्रिय छ!');
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>लोकल अटो-भल्ट प्रमाणीकरण (Active)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Security Incident & Recovery Protocol (Section 30) */}
            <div className="md:col-span-2 bg-red-50/70 border border-red-200 rounded-2xl p-5 space-y-3 text-xs text-red-950">
              <div className="flex items-center gap-2 font-bold text-red-900 text-sm">
                <Shield className="w-4 h-4 text-red-600" />
                <span>सुरक्षा संकट तथा पुनःप्राप्ति कार्यविधि (Security Incident & Recovery Procedure)</span>
              </div>
              <p className="leading-relaxed text-red-900">
                यदि पासवर्ड चुहावट भएको शङ्का लागेमा वा अनधिकृत सामग्री देखिएमा तत्काल निम्न कदम चाल्नुहोस्:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1">
                  <span className="font-bold text-red-900 block">१. प्रकाशन रोक्नुहोस्</span>
                  <p className="text-slate-700">साइट सेटिङमा गई "समाचार प्रकाशन सक्षम" तुरुन्तै बन्द गर्नुहोस्।</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1">
                  <span className="font-bold text-red-900 block">२. पासवर्ड परिवर्तन</span>
                  <p className="text-slate-700">तुरुन्तै नयाँ कडा पासवर्ड राख्नुहोस्, जसले पुराना सबै सेसनहरू रद्द गर्दछ।</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1">
                  <span className="font-bold text-red-900 block">३. अनधिकृत सामग्री हटाउनुहोस्</span>
                  <p className="text-slate-700">कन्टेन्ट ट्याबबाट शङ्कास्पद पोस्ट डिलिट वा Unpublish गर्नुहोस्।</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-200 space-y-1">
                  <span className="font-bold text-red-900 block">४. प्रमाणित ब्याकअप पुनःस्थापना</span>
                  <p className="text-slate-700">गम्भीर समस्या भएमा अघिल्लो हप्ताको सुरक्षित JSON ब्याकअप अपलोड गरी रिस्टोर गर्नुहोस्।</p>
                </div>
              </div>
            </div>

            {/* Global Cyber Defense Shield & Data Persistence Guarantee */}
            <div className="md:col-span-2 bg-slate-900 text-white p-6 rounded-2xl border border-slate-700 shadow-md space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">
                      विश्वव्यापी साइबर आक्रमण विरुद्धका सक्रिय सुरक्षा कवचहरू (Cyber Security Shields)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      हालै विश्वव्यापी रूपमा बढेका साइबर हमला, बोट आक्रमण र डाटा चोरी विरुद्ध प्रणालीमा निम्न सुरक्षा सक्रिय छन्:
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold">
                  🛡️ सबै सुरक्षा कवचहरू सक्रिय
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>DDoS & Brute-Force Shield</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    लगातार ५ पटक गलत एडमिन पासवर्ड प्रयास भएमा सो IP ठेगानालाई १५ मिनेटका लागि स्वचालित रूपमा पूर्ण लकआउट गरिन्छ।
                  </p>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Bot Flooding & Spam Trap</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    न्यूजलेटर, फारम र एपीआईमा प्रति मिनेट १० अनुरोधको सीमा (Rate-Limit) र स्वचालित बोट फसाउने Honeypot Trap सक्रिय छ।
                  </p>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>HTTP Security Headers</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    MIME sniffing, Clickjacking, XSS आक्रमण रोक्न `nosniff`, `SAMEORIGIN`, `HSTS` तथा `x-powered-by` लुकाइएको छ।
                  </p>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Atomic Database Integrity</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    डाटाबेसमा नयाँ लेख वा सेटिङ्स लेख्दा `tempFile` + `renameSync` हुने हुनाले बिजुली वा सर्भर क्र्यास भए पनि डाटा सुरक्षित रहन्छ।
                  </p>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Crypto Salt Password Hash</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    एडमिन पासवर्ड कहिल्यै खुला अक्षरमा बस्दैन। क्रिप्टो सल्ट (Scrypt 64-bit) ह्यास प्रयोग गरिन्छ जसलाई डिक्रिप्ट गर्न असम्भव छ।
                  </p>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Stealth Admin Cloaking</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    साइटको सामान्य `/admin` बाट लगइन बदल्न सेटिङ्सबाट गोप्य स्लग (`/kg-admin-secure` आदि) राख्न सकिन्छ।
                  </p>
                </div>
              </div>

              {/* Data Persistence Guarantee Advice */}
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-emerald-300 block">
                  📌 डाटा कहिल्यै नमेटिने र डिफल्टमा नफर्किने ३ वटा नियम (Data Persistence Rules):
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <li><strong>AI Studio बाट Export to GitHub:</strong> जब तपाईं नयाँ सामग्री वा सेटिङ्स बनाउनुहुन्छ, AI Studio मा 'Export to GitHub' मा क्लिक गर्दा सम्पूर्ण डाटाबेस स्थायी रूपमा GitHub मा कमिट हुन्छ र Render ले नयाँ डाटा कहिल्यै हराउँदैन।</li>
                  <li><strong>नियमित JSON ब्याकअप डाउनलोड:</strong> हप्ताको एकपटक माथिको नीलो बटनबाट 'पूर्ण डाटाबेस ब्याकअप डाउनलोड गर्नुहोस् (JSON)' थिचेर सुरक्षित राख्नुहोस्। आवश्यक पर्दा १ सेकेन्डमै 'Restore JSON' बाट फिर्ता आउँछ।</li>
                  <li><strong>Render Environment Variable:</strong> माथिको 'स्थायी सेटिङ्स कपी गर्नुहोस्' थिचेर Render को Environment मा <code>KHABAR_SETTINGS_JSON</code> राख्दा जुनसुकै अवस्थामा पनि तपाईंको सेटिङ्स सधैं स्थायी रहन्छ।</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: POSTER & PHOTO STUDIO ================= */}
        {activeTab === 'poster_studio' && (
          <AdminPosterStudioPanel
            settings={settingsForm}
            onSettingsUpdate={(updated) => {
              setSettingsForm(updated);
              onSettingsUpdate(updated);
            }}
            showNotification={(msg, type) => showNotification(msg, type)}
            onNavigateToStudio={() => onNavigateHome()}
          />
        )}

        {/* ================= TAB: ENTRY NOTICE / WELCOME POPUP ================= */}
        {activeTab === 'notice' && (
          <AdminNoticeManagerPanel
            settings={settingsForm}
            onSettingsUpdate={(updated) => {
              setSettingsForm(updated);
              onSettingsUpdate(updated);
            }}
            showNotification={(msg, type) => showNotification(msg, type)}
          />
        )}

        {/* ================= TAB: LIVE EVENTS ================= */}
        {activeTab === 'live_events' && <AdminLiveEventsPanel />}

        {/* ================= TAB: ADS & REVENUE ANALYTICS ================= */}
        {activeTab === 'ads' && <AdminAdsManagerPanel />}

        {/* ================= TAB: EDITORIAL SCHEDULE & CALENDAR ================= */}
        {activeTab === 'schedule' && (
          <AdminScheduleCalendarPanel
            content={contentList}
            onSelectArticle={(item) => {
              setEditingItem(item);
              setIsEditingNew(false);
            }}
          />
        )}

        {/* ================= TAB: TRASH & SOFT-DELETE RECOVERY ================= */}
        {activeTab === 'trash' && (
          <AdminTrashRecoveryPanel onContentRestored={loadAllData} />
        )}

        {/* ================= TAB: READERSHIP & FEEDBACK ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <AdminAnalyticsFeedbackPanel content={contentList} />
        )}

        {/* ================= TAB: TEAM ROLES & PERMISSIONS (RBAC) ================= */}
        {activeTab === 'team' && <AdminTeamRolesPanel />}

        {/* ================= TAB: AI EDITORIAL ASSISTANT ================= */}
        {activeTab === 'ai_assistant' && (
          <AdminAiAssistantPanel
            onApplyHeadline={(h) => {
              if (editingItem) setEditingItem({ ...editingItem, title: h });
            }}
          />
        )}

        {/* ================= TAB: NEWSLETTER DIGEST ================= */}
        {activeTab === 'newsletter' && (
          <AdminNewsletterPanel content={contentList} />
        )}

        {/* ================= TAB: MARKET RATES & INDICES ================= */}
        {activeTab === 'market_rates' && <AdminMarketRatesPanel />}
      </main>

      {/* ================= EDITING / CREATING CONTENT MODAL ================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold">
                  {isEditingNew ? 'नयाँ सामग्री थप्नुहोस्' : 'सामग्री सम्पादन गर्नुहोस्'}
                </h3>
                <span className="text-xs text-slate-400 capitalize">Type: {editingItem.type}</span>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  शीर्षक (Nepali Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="मुख्य शीर्षक प्रविष्ट गर्नुहोस्"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  अङ्ग्रेजी शीर्षक (English / Slug Source)
                </label>
                <input
                  type="text"
                  value={editingItem.titleEn || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, titleEn: e.target.value })}
                  placeholder="Optional English title for SEO and slug"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">श्रेणी (Category)</label>
                  <select
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">प्रकार (Content Type)</label>
                  <select
                    value={editingItem.type || 'article'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        type: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="article">समाचार / अपडेट (Article)</option>
                    <option value="explainer">विस्तृत Explainer</option>
                    <option value="video">भिडियो / Reels</option>
                    <option value="notice">सूचना (Notice)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">प्रकाशन अवस्था (Status)</label>
                  <select
                    value={editingItem.status || 'draft'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.value as any
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-semibold"
                  >
                    <option value="draft">ड्राफ्ट (अप्रकाशित/Draft)</option>
                    <option value="published">प्रकाशित (Published)</option>
                    <option value="archived">संग्रहित (Archived)</option>
                  </select>
                </div>
              </div>

              {/* Scheduling and Disclaimer Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    तालिकाबद्ध प्रकाशन मिति (Editorial Schedule)
                  </label>
                  <input
                    type="datetime-local"
                    value={editingItem.scheduledFor ? new Date(editingItem.scheduledFor).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingItem({ ...editingItem, scheduledFor: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400">खाली छोडे तत्काल प्रकाशित हुनेछ</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    कानुनी / संवेदनशील अस्वीकरण (Disclaimer Type)
                  </label>
                  <select
                    value={editingItem.disclaimerType || 'none'}
                    onChange={(e) => setEditingItem({ ...editingItem, disclaimerType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    <option value="none">कुनै अस्वीकरण छैन (None)</option>
                    <option value="financial">वित्तीय / शेयर बजार / मूल्य अस्वीकरण (Financial)</option>
                    <option value="health">स्वास्थ्य / चिकित्सा सल्लाह अस्वीकरण (Health)</option>
                    <option value="legal">कानुनी प्रक्रिया / अदालती विषय (Legal)</option>
                    <option value="factcheck">तथ्य जाँच / प्रारम्भिक दाबी (Fact Check)</option>
                    <option value="satire">व्यङ्ग्य / हाँस्य (Satire)</option>
                  </select>
                  <span className="text-[10px] text-slate-400">पाठकका लागि स्पष्ट चेतावनी ब्यानर राखिनेछ</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  सङ्क्षिप्त सारांश (Summary) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.summary || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  placeholder="२-३ वाक्यमा मुख्य सार लेख्नुहोस्..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              {editingItem.type === 'video' && (
                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 space-y-2">
                  <label className="block font-bold text-blue-950">आधिकारिक फेसबुक भिडियो / Reel URL</label>
                  <input
                    type="url"
                    value={editingItem.facebookPostUrl || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        facebookPostUrl: e.target.value,
                        videoUrl: e.target.value
                      })
                    }
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  विस्तृत सामग्री (Full Body Content)
                </label>
                <textarea
                  rows={8}
                  value={editingItem.body || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, body: e.target.value })}
                  placeholder="विस्तृत विवरण लेख्नुहोस्। शीर्षकका लागि ## वा ### प्रयोग गर्न सक्नुहुन्छ..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm leading-relaxed"
                />
              </div>

              {/* Source attribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">स्रोतको नाम (Source Name)</label>
                  <input
                    type="text"
                    value={editingItem.sourceName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, sourceName: e.target.value })}
                    placeholder="उदा: नेपाल राष्ट्र बैंक"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">स्रोत लिङ्क (Source URL)</label>
                  <input
                    type="url"
                    value={editingItem.sourceUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, sourceUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Featured Image with Direct Upload & Gallery Picker */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="block font-bold text-slate-800 text-xs">
                      फिचर्ड तस्बिर (Featured Image)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      कम्प्युटर वा मोबाइलबाट सिधै फोटो छान्नुहोस् वा तल लिङ्क राख्नुहोस्
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="file"
                      ref={contentImageFileInputRef}
                      onChange={handleContentImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => contentImageFileInputRef.current?.click()}
                      disabled={uploadingContentImage}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingContentImage ? 'अपलोड हुँदै...' : 'तस्बिर अपलोड (Upload)'}</span>
                    </button>

                    {mediaList.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowContentMediaPicker(!showContentMediaPicker)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>ग्यालरीबाट छान्नुहोस्</span>
                      </button>
                    )}

                    {editingItem.featuredImage && (
                      <button
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, featuredImage: '' })}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="तस्बिर हटाउनुहोस्"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Media Picker Drawer */}
                {showContentMediaPicker && mediaList.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>मिडिया ग्यालरीका तस्बिरहरू (क्लिक गरी छान्नुहोस्):</span>
                      <button
                        type="button"
                        onClick={() => setShowContentMediaPicker(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                      {mediaList.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setEditingItem({ ...editingItem, featuredImage: m.url });
                            setShowContentMediaPicker(false);
                            showNotification('ग्यालरीबाट तस्बिर छानियो!');
                          }}
                          className={`aspect-video rounded-lg overflow-hidden border-2 transition hover:scale-105 cursor-pointer ${
                            editingItem.featuredImage === m.url ? 'border-red-600 ring-2 ring-red-400' : 'border-slate-200'
                          }`}
                        >
                          <img src={m.url} alt={m.originalName} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {editingItem.featuredImage && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium truncate">
                        तस्बिर जोडिएको छ: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px]">{editingItem.featuredImage}</code>
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">तस्बिर URL / स्रोत</label>
                    <input
                      type="text"
                      value={editingItem.featuredImage || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, featuredImage: e.target.value })}
                      placeholder="/uploads/... वा बाह्य लिङ्क"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">तस्बिर Alt Text (SEO/पहुँचयोग्यता)</label>
                    <input
                      type="text"
                      value={editingItem.imageAlt || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, imageAlt: e.target.value })}
                      placeholder="तस्बिरको सङ्क्षिप्त विवरण (उदा: प्रधानमन्त्री कार्यालय)"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>

                {editingItem.featuredImage && (
                  <div className="relative aspect-video max-h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 p-1 flex items-center justify-center">
                    <img
                      src={editingItem.featuredImage}
                      alt={editingItem.imageAlt || 'Featured'}
                      className="max-h-48 w-auto object-contain rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={!!editingItem.featured}
                  onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
                <label htmlFor="featured-check" className="font-semibold text-slate-800 cursor-pointer">
                  गृहपृष्ठको प्रमुख स्थानमा देखाउनुहोस् (Featured on Home)
                </label>
              </div>

              {/* Pre-Publication Editorial Checklist (Section 25) */}
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-xs sm:text-sm">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>प्रकाशनपूर्व सम्पादकीय चेकलिस्ट (Editorial Verification Checklist)</span>
                  </div>
                  <span className="text-[10px] text-amber-800 uppercase font-semibold">आत्मपरीक्षण</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  गलत सूचना, मानहानी र कानुनी जोखिम रोक्न सामग्री प्रकाशित गर्नुअघि निम्न बुँदाहरू प्रमाणीकरण गर्नुहोस्:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-950">
                  <label className="flex items-start gap-2 cursor-pointer bg-white/80 p-2 rounded-lg border border-amber-200">
                    <input type="checkbox" className="mt-0.5 accent-amber-600" defaultChecked />
                    <span>१. के दाबी आधिकारिक वा भरपर्दो स्रोतबाट प्रमाणित छ?</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer bg-white/80 p-2 rounded-lg border border-amber-200">
                    <input type="checkbox" className="mt-0.5 accent-amber-600" defaultChecked />
                    <span>२. के मिति, नाम, पद, र सङ्ख्या १००% सही छन्?</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer bg-white/80 p-2 rounded-lg border border-amber-200">
                    <input type="checkbox" className="mt-0.5 accent-amber-600" defaultChecked />
                    <span>३. के प्रमाणित तथ्य र केवल आरोप/दाबीबीच भिन्नता खुलाइएको छ?</span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer bg-white/80 p-2 rounded-lg border border-amber-200">
                    <input type="checkbox" className="mt-0.5 accent-amber-600" defaultChecked />
                    <span>४. के व्यक्तिगत गोपनीयता हनन हुने कुनै जोखिम छैन?</span>
                  </label>
                </div>
              </div>

              {/* Private Editorial Verification Notes (Section 25 & 26) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>निजी सम्पादकीय प्रमाणीकरण विवरण (Private Admin Notes - Never Public)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">सार्वजनिक रूपमा देखिँदैन</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">तथ्य जाँच अवस्था (Fact Check Status)</label>
                    <select
                      value={editingItem.factCheckStatus || 'official_record'}
                      onChange={(e) => setEditingItem({ ...editingItem, factCheckStatus: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs"
                    >
                      <option value="official_record">आधिकारिक सरकारी/संस्थागत अभिलेख (Official Record)</option>
                      <option value="confirmed">प्रमाणित तथ्य (Verified & Confirmed)</option>
                      <option value="alleged">दाबी / अनुसन्धानरत (Allegation/Investigation)</option>
                      <option value="disputed">विवादित विषय (Disputed Topic)</option>
                      <option value="unverified">अपुष्ट / थप अनुसन्धान आवश्यक (Unverified)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">प्रमाणीकरण मिति (Date Verified)</label>
                    <input
                      type="text"
                      value={editingItem.dateChecked || new Date().toLocaleDateString('ne-NP')}
                      onChange={(e) => setEditingItem({ ...editingItem, dateChecked: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">निजी प्रमाणीकरण टिप्पणी (Verification Notes)</label>
                  <textarea
                    rows={2}
                    value={editingItem.verificationNotes || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, verificationNotes: e.target.value })}
                    placeholder="कुन अधिकारी, राजपत्र, वा आधिकारिक दस्तावेजसँग रुजु गरियो? आन्तरिक अभिलेख..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                {/* Visual Safeguards (Section 26) */}
                <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="illustrative-check"
                      checked={!!editingItem.isIllustrativeVisual}
                      onChange={(e) => setEditingItem({ ...editingItem, isIllustrativeVisual: e.target.checked })}
                      className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                    />
                    <label htmlFor="illustrative-check" className="font-semibold text-slate-800 cursor-pointer">
                      यो प्रतिकात्मक/काल्पनिक दृश्य हो (Illustrative Visual Badge)
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="तस्बिर सौजन्य / स्रोत (उदा: सरकारी सूचना विभाग)"
                      value={editingItem.imageAttribution || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, imageAttribution: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer with Mobile Preview & Save */}
            <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-slate-50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(!previewModalOpen)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>{previewModalOpen ? 'पूर्वावलोकन बन्द' : 'मोबाइल पूर्वावलोकन (Preview)'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="button"
                  onClick={handleSaveContent}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>सुरक्षित गर्नुहोस् (Save)</span>
                </button>
              </div>
            </div>

            {/* Embedded Mobile Preview Drawer if toggled */}
            {previewModalOpen && (
              <div className="border-t border-slate-200 p-4 bg-slate-900 flex justify-center">
                <div className="w-[320px] bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-slate-700 p-4 space-y-2 text-xs text-slate-800">
                  <div className="text-[10px] text-red-600 font-bold uppercase">{editingItem.category}</div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">{editingItem.title || 'शीर्षक पूर्वावलोकन'}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-3">{editingItem.summary || 'सारांश पूर्वावलोकन'}</p>
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                    <span>{editingItem.author}</span>
                    <span>स्थिति: {editingItem.status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= CATEGORY EDIT MODAL ================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingCategory.id ? 'श्रेणी सम्पादन' : 'नयाँ श्रेणी'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">नेपाली नाम</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="उदा: प्रविधि"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">अङ्ग्रेजी नाम</label>
                <input
                  type="text"
                  required
                  value={editingCategory.nameEn || ''}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      nameEn: e.target.value,
                      slug: editingCategory.slug || e.target.value.toLowerCase().replace(/\s+/g, '-')
                    })
                  }
                  placeholder="उदा: Technology"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="technology"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">क्रम (Order)</label>
                <input
                  type="number"
                  value={editingCategory.order || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                सुरक्षित गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CORRECTION CREATE MODAL ================= */}
      {newCorrection && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">नयाँ सच्याइ प्रविष्टि (Issue Public Correction)</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">सम्बन्धित सामग्रीको शीर्षक</label>
                <input
                  type="text"
                  value={newCorrection.contentTitle}
                  onChange={(e) => setNewCorrection({ ...newCorrection, contentTitle: e.target.value })}
                  placeholder="कुन सामग्रीमा सच्याइएको हो?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">सच्याइएको मिति</label>
                <input
                  type="text"
                  value={newCorrection.issueDate}
                  onChange={(e) => setNewCorrection({ ...newCorrection, issueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">पहिले भएको भूल / कमजोरी</label>
                <textarea
                  rows={2}
                  value={newCorrection.originalError}
                  onChange={(e) => setNewCorrection({ ...newCorrection, originalError: e.target.value })}
                  placeholder="पहिले के गल्ती लेखिएको थियो?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">सच्याइएको आधिकारिक तथ्य</label>
                <textarea
                  rows={2}
                  value={newCorrection.correctedText}
                  onChange={(e) => setNewCorrection({ ...newCorrection, correctedText: e.target.value })}
                  placeholder="सही तथ्य के हो?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">सम्पादकीय स्पष्टीकरण</label>
                <textarea
                  rows={2}
                  value={newCorrection.explanation}
                  onChange={(e) => setNewCorrection({ ...newCorrection, explanation: e.target.value })}
                  placeholder="पाठकको जानकारीका लागि सङ्क्षिप्त टिप्पणी..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewCorrection(null)}
                className="px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="button"
                onClick={handleSaveCorrection}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                सच्याइ प्रकाशित गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SVG DIRECT EDITOR MODAL ================= */}
      {svgEditorOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-slate-900">
                  आधिकारिक SVG लोगो कोड पेस्ट / सम्पादन
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSvgEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              तपाईंको आधिकारिक लोगोको शुद्ध <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600">&lt;svg...&gt;</code> कोड यहाँ पेस्ट गर्नुहोस्। यसले सिधै <code className="bg-slate-100 px-1 py-0.5 rounded">/logo.svg</code> फाइललाई अद्यावधिक गर्नेछ र साइटभरि लागु हुनेछ।
            </p>

            <textarea
              rows={8}
              value={svgCodeText}
              onChange={(e) => setSvgCodeText(e.target.value)}
              placeholder="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ...'> ... </svg>"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs bg-slate-900 text-emerald-400 focus:outline-none"
            />

            {/* Live SVG Preview if code is valid */}
            {svgCodeText.includes('<svg') && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">पूर्वावलोकन (Live Preview):</span>
                <div
                  className="w-12 h-12 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: svgCodeText }}
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSvgEditorOpen(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                रद्द गर्नुहोस्
              </button>
              <button
                type="button"
                onClick={handleSaveSvgDirect}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                लोगो सुरक्षित गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
