import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Share2,
  RefreshCw,
  Copy,
  Check,
  Facebook,
  Sparkles,
  Sliders,
  Type,
  Palette,
  Layout,
  Tag,
  Gift,
  PartyPopper,
  Megaphone,
  Newspaper,
  Calendar,
  AlertCircle,
  Shield,
  Eye,
  Info,
  Lock,
  ExternalLink
} from 'lucide-react';
import { SiteSettings } from '../types';

interface PosterStudioPageProps {
  settings?: SiteSettings;
  onNavigate?: (path: string) => void;
}

type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9';
type ThemeId = 'khabar-classic' | 'crimson-festive' | 'royal-blue' | 'mountain-emerald' | 'minimal-slate' | 'sunset-terracotta';
type FontStyle = 'sans' | 'serif' | 'display';

interface PosterTemplate {
  id: string;
  category: 'festivals' | 'greetings' | 'gift' | 'facebook' | 'business' | 'announcement' | 'news' | 'event';
  categoryLabel: string;
  name: string;
  headline: string;
  subheadline: string;
  eventTitle: string;
  greetingPhrase: string;
  senderName: string;
  recipientName: string;
  date: string;
  giftNote?: string;
  sourceText?: string;
  theme: ThemeId;
  defaultAspect: AspectRatio;
  isAiVisualDisclaimer: boolean;
}

const TEMPLATES: PosterTemplate[] = [
  // 1. Festivals
  {
    id: 'dashain-tihar',
    category: 'festivals',
    categoryLabel: 'चाडपर्व तथा संस्कृति',
    name: 'बडा दशैं तथा तिहार मङ्गलमय शुभकामना',
    headline: 'बिजया दशमी तथा शुभ दीपावलीको हार्दिक मङ्गलमय शुभकामना',
    subheadline: 'सुस्वास्थ्य, दीर्घायु, सुख, शान्ति र उत्तरोत्तर प्रगतिको कामना गर्दछौँ।',
    eventTitle: 'बडा दशैं, तिहार तथा छठ पर्व',
    greetingPhrase: 'चाडपर्वले सम्पूर्ण नेपालीहरूमा सुख र शान्ति छाओस्!',
    senderName: 'खबर GPT परिवार र शुभचिन्तकहरू',
    recipientName: 'सम्पूर्ण आदरणीय दाजुभाइ तथा दिदीबहिनीहरूमा',
    date: 'वि.सं. २०८२',
    theme: 'crimson-festive',
    defaultAspect: '1:1',
    isAiVisualDisclaimer: false
  },
  {
    id: 'teej-chwath',
    category: 'festivals',
    categoryLabel: 'चाडपर्व तथा संस्कृति',
    name: 'हरितालिका तीज / छठ पर्व',
    headline: 'पवित्र हरितालिका तीज तथा छठ पर्वको मङ्गलमय शुभकामना',
    subheadline: 'नेपाली मौलिक संस्कृति, आपसी सद्भाव र पारिवारिक एकता सदैव कायम रहोस्।',
    eventTitle: 'नेपाली नारीहरूको महान् उत्सव',
    greetingPhrase: 'उल्लासमय चाडको हार्दिक शुभकामना!',
    senderName: 'सम्पादकीय तथा डिजिटल टिम',
    recipientName: 'सम्पूर्ण दिदीबहिनी तथा आमाहरूमा',
    date: 'भाद्र / कार्तिक २०८२',
    theme: 'sunset-terracotta',
    defaultAspect: '4:5',
    isAiVisualDisclaimer: false
  },
  // 2. Birthday & Anniversary
  {
    id: 'birthday-card',
    category: 'greetings',
    categoryLabel: 'जन्मदिन तथा वार्षिकोत्सव',
    name: 'जन्मदिनको लाखौं लाख शुभकामना',
    headline: 'जन्मदिनको हार्दिक मङ्गलमय शुभकामना!',
    subheadline: 'आगामी वर्षहरू अझ धेरै खुशी, सफलता र सुस्वास्थ्यले भरिपूर्ण रहून्।',
    eventTitle: 'शुभ जन्मदिन (Happy Birthday)',
    greetingPhrase: 'सधैं मुस्कुराइरहनुहोस् र जीवनमा लक्ष्य प्राप्त गर्नुहोस्!',
    senderName: 'तपाईंका प्यारा साथीहरू तथा परिवार',
    recipientName: 'प्रिय साथी / परिवारजन',
    date: 'आजको शुभ दिन',
    giftNote: 'तपाईंको उपस्थितिले हाम्रो जीवन सधैं उज्यालो बनाएको छ।',
    theme: 'royal-blue',
    defaultAspect: '1:1',
    isAiVisualDisclaimer: false
  },
  {
    id: 'wedding-anniversary',
    category: 'greetings',
    categoryLabel: 'जन्मदिन तथा वार्षिकोत्सव',
    name: 'वैवाहिक वार्षिकोत्सवको शुभकामना',
    headline: 'वैवाहिक वार्षिकोत्सवको हार्दिक शुभकामना!',
    subheadline: 'तपाईंहरूको वैवाहिक जीवन सधैं प्रेम, विश्वास र सद्भावले सजिएको रहोस्।',
    eventTitle: 'Happy Wedding Anniversary',
    greetingPhrase: 'सधैंभरि एकअर्काको साथ र माया प्रगाढ बनिरहोस्।',
    senderName: 'सम्पूर्ण परिवार र आफन्तजन',
    recipientName: 'आदरणीय जोडी (दम्पती)',
    date: 'वार्षिकोत्सव मिति',
    theme: 'crimson-festive',
    defaultAspect: '1:1',
    isAiVisualDisclaimer: false
  },
  // 3. Gift Card
  {
    id: 'special-gift-card',
    category: 'gift',
    categoryLabel: 'उपहार कार्ड (Gift Card)',
    name: 'हार्दिक उपहार तथा कृतज्ञता कार्ड',
    headline: 'तपाईंका लागि एउटा सानो उपहार तथा कृतज्ञता',
    subheadline: 'तपाईंले पुर्‍याउनुभएको माया र अमूल्य सहयोगको लागि हृदयदेखि धन्यवाद।',
    eventTitle: 'विशेष उपहार भौचर / कार्ड',
    greetingPhrase: 'यो उपहारले तपाईंको अनुहारमा खुशी ल्याउनेछ भन्ने आशा छ।',
    senderName: 'कृतज्ञतासहित: प्रेषकको नाम',
    recipientName: 'आदरणीय प्राप्तकर्ताको नाम',
    date: '२०८२',
    giftNote: 'उपहार कोड / विशेष सन्देश: THANKYOU-2082',
    theme: 'minimal-slate',
    defaultAspect: '16:9',
    isAiVisualDisclaimer: false
  },
  // 4. Facebook Page Promotion
  {
    id: 'facebook-promo',
    category: 'facebook',
    categoryLabel: 'फेसबुक पेज प्रवर्द्धन',
    name: 'खबर GPT फेसबुक पेज फलो गर्नुहोस्',
    headline: 'समसामयिक विषय र तथ्यपरक जानकारीका लागि फेसबुकमा जोडिनुहोस्',
    subheadline: 'छिटो, स्पष्ट र विश्वसनीय भिडियो तथा विश्लेषण अब सोझै तपाईंको फेसबुक फिडमा।',
    eventTitle: 'आधिकारिक डिजिटल पृष्ठ',
    greetingPhrase: '👉 फेसबुकमा KhabarGpt खोज्नुहोस् वा Follow गर्नुहोस्',
    senderName: 'Khabar GPT Editorial Desk',
    recipientName: 'नेपाली डिजिटल समुदायका लागि',
    date: 'दैनिक ताजा अपडेट',
    theme: 'khabar-classic',
    defaultAspect: '1:1',
    isAiVisualDisclaimer: false
  },
  // 5. Business Promotion
  {
    id: 'business-offer',
    category: 'business',
    categoryLabel: 'व्यापार तथा अफर',
    name: 'विशेष व्यावसायिक अफर र घोषणा',
    headline: 'नयाँ सेवा शुभारम्भ तथा विशेष सीमित अफर!',
    subheadline: 'गुणस्तरीय सेवा र उचित मूल्यमा तपाईंको आवश्यकता पूरा गर्न हामी तयार छौँ।',
    eventTitle: 'विशेष स्किम / प्रवर्द्धन',
    greetingPhrase: 'अहिले नै सम्पर्क गरी विशेष छुटको लाभ लिनुहोस्।',
    senderName: 'हाम्रो आधिकारिक प्रतिष्ठान',
    recipientName: 'सम्पूर्ण सम्मानित ग्राहकवर्ग',
    date: 'अफर सीमित अवधिका लागि',
    sourceText: 'सम्पर्क: फोन / वेबसाइट / ठेगाना',
    theme: 'mountain-emerald',
    defaultAspect: '1:1',
    isAiVisualDisclaimer: false
  },
  // 6. General Announcements
  {
    id: 'public-notice',
    category: 'announcement',
    categoryLabel: 'सार्वजनिक सूचना',
    name: 'महत्त्वपूर्ण सार्वजनिक जानकारी / सूचना',
    headline: 'सार्वजनिक सरोकारको महत्त्वपूर्ण जानकारी',
    subheadline: 'नागरिक सचेतना र सुरक्षाका लागि सम्बन्धित सबैले यो जानकारी ध्यानपूर्वक पढ्नुहोला।',
    eventTitle: 'सार्वजनिक सूचना (Public Notice)',
    greetingPhrase: 'सचेत नागरिक, सुरक्षित समाज।',
    senderName: 'नागरिक सरोकार समूह',
    recipientName: 'सर्वसाधारण नागरिकको जानकारीका लागि',
    date: 'जारी मिति: २०८२',
    sourceText: 'आधिकारिक सार्वजनिक स्रोतबाट संकलित',
    theme: 'khabar-classic',
    defaultAspect: '4:5',
    isAiVisualDisclaimer: false
  },
  // 7. News-style Informational
  {
    id: 'news-summary',
    category: 'news',
    categoryLabel: 'समाचार शैलीको पोस्टर',
    name: 'तथ्यपरक समाचार सारांश (स्रोतसहित)',
    headline: 'मुख्य समसामयिक घटनाक्रम तथा तथ्यपरक सारांश',
    subheadline: 'नेपालको पछिल्लो आर्थिक तथा सामाजिक अवस्थाको विश्लेषण र मुख्य बुँदाहरू।',
    eventTitle: 'तथ्यपरक डिजिटल विश्लेषण',
    greetingPhrase: 'तथ्य जाँचिएको सूचना मात्र शेयर गरौँ।',
    senderName: 'खबर GPT विश्लेषण डेस्क',
    recipientName: 'पाठकवृन्दका लागि',
    date: 'मिति: २४ अक्टोबर २०२६',
    sourceText: 'स्रोत: सम्बन्धित मन्त्रालय तथा आधिकारिक प्रतिवेदन',
    theme: 'khabar-classic',
    defaultAspect: '1:1',
    isAiVisualDisclaimer: true
  },
  // 8. Event Invitation
  {
    id: 'event-invitation',
    category: 'event',
    categoryLabel: 'निमन्त्रणा तथा कार्यक्रम',
    name: 'विशेष कार्यक्रम तथा अन्तरक्रिया निमन्त्रणा',
    headline: 'विशेष नागरिक अन्तरक्रिया तथा गोष्ठीमा सादर निमन्त्रणा',
    subheadline: 'हाम्रो सामाजिक तथा शैक्षिक छलफल कार्यक्रममा तपाईंको गरिमामय उपस्थितिको अपेक्षा गर्दछौँ।',
    eventTitle: 'वार्षिक विचार गोष्ठी २०२६',
    greetingPhrase: 'तपाईंको उपस्थिति हाम्रो लागि गौरवको विषय हुनेछ।',
    senderName: 'आयोजक समिति',
    recipientName: 'आदरणीय महानुभावहरू',
    date: 'स्थान: काठमाडौँ | मिति: आगामी शनिबार दिउँसो १ बजे',
    giftNote: 'प्रवेश निःशुल्क तर सिट सीमित',
    theme: 'royal-blue',
    defaultAspect: '16:9',
    isAiVisualDisclaimer: false
  }
];

export const PosterStudioPage: React.FC<PosterStudioPageProps> = ({ settings, onNavigate }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('dashain-tihar');
  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];

  // Editable Fields
  const [headline, setHeadline] = useState(currentTemplate.headline);
  const [subheadline, setSubheadline] = useState(currentTemplate.subheadline);
  const [eventTitle, setEventTitle] = useState(currentTemplate.eventTitle);
  const [greetingPhrase, setGreetingPhrase] = useState(currentTemplate.greetingPhrase);
  const [senderName, setSenderName] = useState(currentTemplate.senderName);
  const [recipientName, setRecipientName] = useState(currentTemplate.recipientName);
  const [date, setDate] = useState(currentTemplate.date);
  const [giftNote, setGiftNote] = useState(currentTemplate.giftNote || '');
  const [sourceText, setSourceText] = useState(currentTemplate.sourceText || '');

  // Customization Options
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(currentTemplate.defaultAspect);
  const [theme, setTheme] = useState<ThemeId>(currentTemplate.theme);
  const [fontStyle, setFontStyle] = useState<FontStyle>('sans');
  const [isAiDisclaimer, setIsAiDisclaimer] = useState<boolean>(currentTemplate.isAiVisualDisclaimer);

  // Status & Canvas refs
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // When template changes, load its defaults
  const handleSelectTemplate = (tId: string) => {
    const t = TEMPLATES.find((item) => item.id === tId);
    if (!t) return;
    setSelectedTemplateId(tId);
    setHeadline(t.headline);
    setSubheadline(t.subheadline);
    setEventTitle(t.eventTitle);
    setGreetingPhrase(t.greetingPhrase);
    setSenderName(t.senderName);
    setRecipientName(t.recipientName);
    setDate(t.date);
    setGiftNote(t.giftNote || '');
    setSourceText(t.sourceText || '');
    setTheme(t.theme);
    setAspectRatio(t.defaultAspect);
    setIsAiDisclaimer(t.isAiVisualDisclaimer);
  };

  // Reset to original template state
  const handleReset = () => {
    handleSelectTemplate(selectedTemplateId);
  };

  // Redraw canvas whenever any state changes
  useEffect(() => {
    drawCanvas();
  }, [
    headline,
    subheadline,
    eventTitle,
    greetingPhrase,
    senderName,
    recipientName,
    date,
    giftNote,
    sourceText,
    aspectRatio,
    theme,
    fontStyle,
    isAiDisclaimer
  ]);

  // Canvas drawing routine
  const drawCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions based on aspect ratio
    let width = 1200;
    let height = 1200;

    if (aspectRatio === '4:5') {
      width = 1200;
      height = 1500;
    } else if (aspectRatio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (aspectRatio === '16:9') {
      width = 1600;
      height = 900;
    }

    canvas.width = width;
    canvas.height = height;

    // Load Admin Poster Studio Configuration
    const studioConfig = settings?.posterStudioSettings;
    const logoSrc = studioConfig?.customLogoUrl || settings?.customLogoUrl || '/logo.png';
    const topLogoPos = studioConfig?.topLogoPosition || 'top-left';
    const topLogoSz = studioConfig?.topLogoSize || 'medium';
    const bottomLogoStyle = studioConfig?.bottomLogoStyle || 'circle-white';
    const facebookHandle = studioConfig?.facebookHandle || 'KhabarGpt';
    const showFacebookBadge = studioConfig?.showFacebookBadge ?? true;
    const brandTitle = studioConfig?.brandTitle || 'खबर GPT (Khabar GPT)';
    const websiteDisplay = studioConfig?.websiteDisplay || 'khabargpt.onrender.com';
    const footerTagline = studioConfig?.footerTagline || 'डिजिटल पोस्टर स्टुडियो · आधिकारिक पोर्टल';
    const showWatermark = studioConfig?.showWatermark ?? true;

    // Pre-load Khabar GPT Logo Image
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    const logoPromise = new Promise<void>((resolve) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => resolve();
      logoImg.src = logoSrc;
    });
    await logoPromise;

    // Theme Palettes
    let bgGradStart = '#0f172a';
    let bgGradEnd = '#020617';
    let primaryAccent = '#dc2626';
    let secondaryAccent = '#f59e0b';
    let cardBg = 'rgba(255, 255, 255, 0.05)';
    let cardBorder = 'rgba(255, 255, 255, 0.12)';
    let textColor = '#ffffff';
    let mutedText = '#94a3b8';

    if (theme === 'crimson-festive') {
      bgGradStart = '#7f1d1d';
      bgGradEnd = '#450a0a';
      primaryAccent = '#f59e0b';
      secondaryAccent = '#fde047';
      cardBg = 'rgba(0, 0, 0, 0.25)';
      cardBorder = 'rgba(245, 158, 11, 0.3)';
    } else if (theme === 'royal-blue') {
      bgGradStart = '#1e3a8a';
      bgGradEnd = '#0f172a';
      primaryAccent = '#38bdf8';
      secondaryAccent = '#fbbf24';
      cardBg = 'rgba(255, 255, 255, 0.06)';
      cardBorder = 'rgba(56, 189, 248, 0.25)';
    } else if (theme === 'mountain-emerald') {
      bgGradStart = '#064e3b';
      bgGradEnd = '#022c22';
      primaryAccent = '#34d399';
      secondaryAccent = '#fef08a';
      cardBg = 'rgba(255, 255, 255, 0.06)';
      cardBorder = 'rgba(52, 211, 153, 0.25)';
    } else if (theme === 'sunset-terracotta') {
      bgGradStart = '#7c2d12';
      bgGradEnd = '#431407';
      primaryAccent = '#fb923c';
      secondaryAccent = '#fef08a';
      cardBg = 'rgba(0, 0, 0, 0.3)';
      cardBorder = 'rgba(251, 146, 60, 0.3)';
    } else if (theme === 'minimal-slate') {
      bgGradStart = '#1e293b';
      bgGradEnd = '#0f172a';
      primaryAccent = '#e2e8f0';
      secondaryAccent = '#38bdf8';
      cardBg = 'rgba(255, 255, 255, 0.04)';
      cardBorder = 'rgba(255, 255, 255, 0.1)';
    }

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, bgGradStart);
    gradient.addColorStop(1, bgGradEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric corner subtle borders
    ctx.strokeStyle = cardBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Decorative inner thin frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    // Font Family resolution
    let fontFamily = '"Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif';
    if (fontStyle === 'serif') {
      fontFamily = '"Lora", "Noto Sans Devanagari", Georgia, serif';
    } else if (fontStyle === 'display') {
      fontFamily = '"Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif';
    }

    // 2. Header Area & Official Top Khabar GPT Logo
    let currentY = 85;

    // Render Top Khabar GPT Logo if enabled
    if (topLogoPos !== 'none') {
      const pxSize = topLogoSz === 'small' ? Math.round(width * 0.055) : topLogoSz === 'large' ? Math.round(width * 0.09) : Math.round(width * 0.07);
      let topLogoX = width * 0.055 + 10;
      const topLogoY = 40;

      if (topLogoPos === 'top-center') {
        topLogoX = (width - pxSize) / 2;
        currentY = topLogoY + pxSize + 30;
      } else if (topLogoPos === 'top-right') {
        topLogoX = width - (width * 0.055) - pxSize - 10;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(topLogoX + pxSize / 2, topLogoY + pxSize / 2, pxSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.clip();
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, topLogoX + 2, topLogoY + 2, pxSize - 4, pxSize - 4);
      } else {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(topLogoX, topLogoY, pxSize, pxSize);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(pxSize * 0.45)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('KG', topLogoX + pxSize / 2, topLogoY + pxSize / 2);
      }
      ctx.restore();

      // Top logo brand name label if top-left
      if (topLogoPos === 'top-left') {
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(width * 0.022)}px ${fontFamily}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('खबर GPT', topLogoX + pxSize + 14, topLogoY + pxSize / 2);
      }
    }

    // Category / Event Title Tag
    ctx.fillStyle = primaryAccent;
    ctx.font = `600 ${Math.round(width * 0.024)}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText((eventTitle || 'विशेष डिजिटल सन्देश').toUpperCase(), width / 2, currentY);

    currentY += Math.round(height * 0.038);

    // Recipient Name (To:)
    if (recipientName.trim()) {
      ctx.fillStyle = secondaryAccent;
      ctx.font = `500 ${Math.round(width * 0.026)}px ${fontFamily}`;
      ctx.fillText(recipientName.trim(), width / 2, currentY);
      currentY += Math.round(height * 0.032);
    }

    // Main Card Box (Centered)
    const cardMarginX = width * 0.055;
    const cardWidth = width - cardMarginX * 2;
    const cardTop = currentY + 12;

    // Required Brand Band Dimensions (Bottom)
    const brandBandHeight = Math.max(Math.round(height * 0.095), 84);
    const brandBandY = height - brandBandHeight - 24;
    const cardHeight = brandBandY - cardTop - 18;

    ctx.fillStyle = cardBg;
    ctx.strokeStyle = cardBorder;
    ctx.lineWidth = 1.5;

    // Rounded card background
    const radius = 24;
    ctx.beginPath();
    ctx.moveTo(cardMarginX + radius, cardTop);
    ctx.lineTo(cardMarginX + cardWidth - radius, cardTop);
    ctx.quadraticCurveTo(cardMarginX + cardWidth, cardTop, cardMarginX + cardWidth, cardTop + radius);
    ctx.lineTo(cardMarginX + cardWidth, cardTop + cardHeight - radius);
    ctx.quadraticCurveTo(cardMarginX + cardWidth, cardTop + cardHeight, cardMarginX + cardWidth - radius, cardTop + cardHeight);
    ctx.lineTo(cardMarginX + radius, cardTop + cardHeight);
    ctx.quadraticCurveTo(cardMarginX, cardTop + cardHeight, cardMarginX, cardTop + cardHeight - radius);
    ctx.lineTo(cardMarginX, cardTop + radius);
    ctx.quadraticCurveTo(cardMarginX, cardTop, cardMarginX + radius, cardTop);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Card Inner Text (Headline, Greeting, Subheadline)
    let cardTextY = cardTop + Math.round(cardHeight * 0.12);

    // Greeting Phrase
    if (greetingPhrase.trim()) {
      ctx.fillStyle = secondaryAccent;
      ctx.font = `600 ${Math.round(width * 0.026)}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(`✨ ${greetingPhrase.trim()} ✨`, width / 2, cardTextY);
      cardTextY += Math.round(height * 0.045);
    }

    // Main Headline (Multi-line word wrap)
    ctx.fillStyle = textColor;
    const headlineFontSize = Math.round(width * 0.040);
    ctx.font = `bold ${headlineFontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';

    const words = headline.split(' ');
    let line = '';
    const maxLineWidth = cardWidth - 80;
    const lineHeight = headlineFontSize * 1.35;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && n > 0) {
        ctx.fillText(line.trim(), width / 2, cardTextY);
        line = words[n] + ' ';
        cardTextY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), width / 2, cardTextY);
    cardTextY += Math.round(height * 0.035);

    // Decorative small separator bar
    ctx.fillStyle = primaryAccent;
    ctx.fillRect(width / 2 - 40, cardTextY, 80, 4);
    cardTextY += Math.round(height * 0.035);

    // Subheadline / Message
    ctx.fillStyle = mutedText;
    const subFontSize = Math.round(width * 0.024);
    ctx.font = `normal ${subFontSize}px ${fontFamily}`;
    const subWords = subheadline.split(' ');
    let subLine = '';
    const subLineHeight = subFontSize * 1.45;

    for (let n = 0; n < subWords.length; n++) {
      const testLine = subLine + subWords[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && n > 0) {
        ctx.fillText(subLine.trim(), width / 2, cardTextY);
        subLine = subWords[n] + ' ';
        cardTextY += subLineHeight;
      } else {
        subLine = testLine;
      }
    }
    ctx.fillText(subLine.trim(), width / 2, cardTextY);
    cardTextY += Math.round(height * 0.032);

    // Optional Gift Note / Coupon Code
    if (giftNote.trim()) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      const giftBoxWidth = cardWidth - 120;
      const giftBoxHeight = 46;
      ctx.fillRect(width / 2 - giftBoxWidth / 2, cardTextY, giftBoxWidth, giftBoxHeight);
      ctx.strokeStyle = primaryAccent;
      ctx.strokeRect(width / 2 - giftBoxWidth / 2, cardTextY, giftBoxWidth, giftBoxHeight);

      ctx.fillStyle = secondaryAccent;
      ctx.font = `600 ${Math.round(width * 0.022)}px ${fontFamily}`;
      ctx.fillText(`🎁 ${giftNote.trim()}`, width / 2, cardTextY + 30);
      cardTextY += 65;
    }

    // Optional Source Reference (for news posters)
    if (sourceText.trim()) {
      ctx.fillStyle = '#64748b';
      ctx.font = `italic ${Math.round(width * 0.018)}px ${fontFamily}`;
      ctx.fillText(`स्रोत / विवरण: ${sourceText.trim()}`, width / 2, cardTextY);
      cardTextY += 32;
    }

    // 4. Sender (From:) & Date Bar inside Bottom of Card
    const bottomInfoY = cardTop + cardHeight - 28;
    ctx.fillStyle = textColor;
    ctx.font = `600 ${Math.round(width * 0.024)}px ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.fillText(senderName.trim() ? `प्रेषक: ${senderName.trim()}` : '', cardMarginX + 35, bottomInfoY);

    ctx.textAlign = 'right';
    ctx.fillStyle = mutedText;
    ctx.font = `normal ${Math.round(width * 0.022)}px ${fontFamily}`;
    ctx.fillText(date.trim(), cardMarginX + cardWidth - 35, bottomInfoY);

    // Watermark Stamp inside card
    if (showWatermark) {
      const stampW = Math.round(width * 0.24);
      const stampH = Math.round(height * 0.028);
      const stampX = width / 2 - stampW / 2;
      const stampY = bottomInfoY - stampH - 12;

      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(stampX, stampY, stampW, stampH, stampH / 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold ${Math.round(width * 0.016)}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓ आधिकारिक खबर GPT कार्ड', width / 2, stampY + stampH / 2);
    }

    // 5. REQUIRED KHABAR GPT LOGO, FACEBOOK BADGE & CORRECT WEBSITE LINK
    // AI Visual Disclaimer if enabled (rendered right above the brand band)
    if (isAiDisclaimer) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f59e0b';
      ctx.font = `italic ${Math.round(width * 0.015)}px ${fontFamily}`;
      ctx.fillText(studioConfig?.disclaimerText || '⚠️ नोट: यो सामग्री/चित्रण सांकेतिक हो, प्रत्यक्ष आधिकारिक समाचार तस्बिर होइन।', width / 2, brandBandY - 8);
    }

    // Rounded Capsule for Required Brand Band
    const bandMargin = width * 0.055;
    const bandWidth = width - bandMargin * 2;
    const bRadius = 18;

    ctx.beginPath();
    ctx.moveTo(bandMargin + bRadius, brandBandY);
    ctx.lineTo(bandMargin + bandWidth - bRadius, brandBandY);
    ctx.quadraticCurveTo(bandMargin + bandWidth, brandBandY, bandMargin + bandWidth, brandBandY + bRadius);
    ctx.lineTo(bandMargin + bandWidth, brandBandY + brandBandHeight - bRadius);
    ctx.quadraticCurveTo(bandMargin + bandWidth, brandBandY + brandBandHeight, bandMargin + bandWidth - bRadius, brandBandY + brandBandHeight);
    ctx.lineTo(bandMargin + bRadius, brandBandY + brandBandHeight);
    ctx.quadraticCurveTo(bandMargin, brandBandY + brandBandHeight, bandMargin, brandBandY + brandBandHeight - bRadius);
    ctx.lineTo(bandMargin, brandBandY + bRadius);
    ctx.quadraticCurveTo(bandMargin, brandBandY, bandMargin + bRadius, brandBandY);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fill();
    ctx.strokeStyle = cardBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Official Khabar GPT Logo in Brand Band
    const logoSize = Math.round(brandBandHeight * 0.74);
    const logoX = bandMargin + 16;
    const logoY = brandBandY + (brandBandHeight - logoSize) / 2;

    if (bottomLogoStyle === 'circle-white') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.clip();
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, logoX + 3, logoY + 3, logoSize - 6, logoSize - 6);
      } else {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(logoX, logoY, logoSize, logoSize);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(logoSize * 0.42)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('KG', logoX + logoSize / 2, logoY + logoSize / 2);
      }
      ctx.restore();
    } else if (bottomLogoStyle === 'glow') {
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      }
      ctx.restore();
    } else {
      // transparent seamless PNG
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      }
    }

    // Text Information on Brand Band
    const textLeft = logoX + logoSize + 16;
    const bandCenterY = brandBandY + brandBandHeight / 2;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // 1. Official Brand Name
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(width * 0.026)}px ${fontFamily}`;
    ctx.fillText(brandTitle, textLeft, bandCenterY - 6);

    // 2. Official Facebook Badge: Facebook logo and KhabarGpt only
    if (showFacebookBadge) {
      const fbIconRadius = Math.round(width * 0.0125);
      const fbIconCenterX = textLeft + fbIconRadius;
      const fbIconCenterY = bandCenterY + 18;

      // Facebook Blue Circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(fbIconCenterX, fbIconCenterY, fbIconRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#1877F2';
      ctx.fill();

      // White 'f' inside
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${Math.round(fbIconRadius * 1.45)}px "Helvetica Neue", Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('f', fbIconCenterX + 0.8, fbIconCenterY + 0.8);
      ctx.restore();

      // Facebook handle (Facebook logo and KhabarGpt only)
      ctx.fillStyle = '#e0f2fe';
      ctx.font = `bold ${Math.round(width * 0.020)}px ${fontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(facebookHandle, fbIconCenterX + fbIconRadius + 8, fbIconCenterY);
    }

    // 3. Official Website Link (Right Side)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f87171';
    ctx.font = `bold ${Math.round(width * 0.021)}px ${fontFamily}`;
    ctx.fillText(websiteDisplay, bandMargin + bandWidth - 20, bandCenterY - 4);

    ctx.fillStyle = '#94a3b8';
    ctx.font = `normal ${Math.round(width * 0.016)}px ${fontFamily}`;
    ctx.fillText(footerTagline, bandMargin + bandWidth - 20, bandCenterY + 20);
  };

  // Download high-resolution PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const filename = `KhabarGPT_Poster_${selectedTemplateId}_${Date.now()}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  // Share using Web Share API or fallback
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (navigator.share && navigator.canShare) {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'poster.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            const fbName = settings?.posterStudioSettings?.facebookHandle || 'KhabarGpt';
            await navigator.share({
              title: headline,
              text: `${headline}\n${greetingPhrase}\n\n📢 फेसबुक: ${fbName}\n🌐 आधिकारिक पोर्टल: https://khabargpt.onrender.com/poster-studio`,
              files: [file]
            });
            setShareSuccess(true);
            setTimeout(() => setShareSuccess(false), 4000);
          } else {
            fallbackShareText();
          }
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          fallbackShareText();
        }
      }
    } else {
      fallbackShareText();
    }
  };

  const fallbackShareText = () => {
    const fbName = settings?.posterStudioSettings?.facebookHandle || 'KhabarGpt';
    const textToCopy = `${headline}\n${greetingPhrase}\n${subheadline}\nप्रेषक: ${senderName}\n\n📢 आधिकारिक फेसबुक: ${fbName}\n🌐 डिजिटल पोस्टर स्टुडियो: https://khabargpt.onrender.com/poster-studio`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  // Direct Facebook Share Link using correct onrender link
  const handleFacebookShare = () => {
    const shareUrl = encodeURIComponent(`https://khabargpt.onrender.com/poster-studio`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'width=600,height=500');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* 1. Header Banner & Identity */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Khabar GPT Digital Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            डिजिटल पोस्टर तथा शुभकामना कार्ड स्टुडियो
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            नेपाली चाडपर्व, जन्मदिन, उपहार कार्ड, फेसबुक प्रवर्द्धन र सूचना पोस्टरहरू सजिलै सम्पादन गरी उच्च-गुणस्तर (High-Resolution) मा डाउनलोड र शेयर गर्नुहोस्।
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="पुन: सुरुवाती अवस्थामा फर्काउनुहोस्"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>रिसेट (Reset)</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'तयार हुँदै...' : 'पोस्टर डाउनलोड (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* 2. Template Category Selector Tabs */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-red-600" />
          <span>१. उपलब्ध टेम्प्लेट छान्नुहोस् (Choose Template)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === selectedTemplateId;
            return (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-red-600 bg-red-50 text-red-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1 truncate">
                  {tmpl.categoryLabel}
                </span>
                <span className="line-clamp-2 leading-snug">{tmpl.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Split View: Editing Controls (Left) & Real-time Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Fields & Settings (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>२. पोस्टर सम्पादन तथा विवरण (Customization Details)</span>
          </h2>

          <div className="space-y-4">
            {/* Headline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                मुख्य शीर्षक / सन्देश (Main Headline) *
              </label>
              <textarea
                rows={2}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 font-medium"
                placeholder="पोस्टरको मुख्य शीर्षक लेख्नुहोस्..."
              />
            </div>

            {/* Greeting Phrase & Event Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  शुभकामना पदावली (Greeting Phrase)
                </label>
                <input
                  type="text"
                  value={greetingPhrase}
                  onChange={(e) => setGreetingPhrase(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
                  placeholder="उदा: हार्दिक मङ्गलमय शुभकामना!"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  उत्सव / कार्यक्रम शीर्षक (Event Title)
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
                  placeholder="उदा: बडा दशैं, जन्मदिन, सार्वजनिक सूचना"
                />
              </div>
            </div>

            {/* Subheadline / Supporting text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                सहायक विवरण / सन्देश (Supporting Text)
              </label>
              <textarea
                rows={2}
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
                placeholder="सहायक विवरण वा शुभकामना वाक्य..."
              />
            </div>

            {/* Sender & Recipient Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  प्रेषकको नाम (From / Sender Name)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="तपाईंको वा संस्थाको नाम"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  प्राप्तकर्ताको नाम (To / Recipient Name)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="जसलाई पठाउने हो उसको नाम"
                />
              </div>
            </div>

            {/* Date & Optional Gift Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मिति / समय (Date or Time)
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
                  placeholder="उदा: वि.सं. २०८२ / 24 Oct 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  उपहार कोड / विशेष टिप्पणी (Gift Note)
                </label>
                <input
                  type="text"
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
                  placeholder="ऐच्छिक: उपहार कोड वा विशेष टिप्पणी"
                />
              </div>
            </div>

            {/* Optional Source Text for News-style posters */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                समाचार स्रोत / सन्दर्भ (Source & Verification Date)
              </label>
              <input
                type="text"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
                placeholder="उदा: राष्ट्रिय योजना आयोग / मन्त्रालयको आधिकारिक प्रेस विज्ञप्ति"
              />
            </div>
          </div>

          {/* Visual Style & Format Settings */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              शैली तथा लेआउट छनोट (Layout & Styling)
            </h3>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                पोस्टर आकार (Format):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '1:1', label: 'वर्गकार (1:1)', desc: 'FB/Insta' },
                  { id: '4:5', label: 'ठाडो (4:5)', desc: 'Mobile Feed' },
                  { id: '9:16', label: 'स्टोरी (9:16)', desc: 'Reels/Status' },
                  { id: '16:9', label: 'तेर्सो (16:9)', desc: 'Web/Banner' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAspectRatio(item.id as AspectRatio)}
                    className={`py-2 px-1 text-center rounded-xl border text-xs cursor-pointer transition-all ${
                      aspectRatio === item.id
                        ? 'border-red-600 bg-red-50 text-red-700 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                रङ थिम (Color Theme):
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'khabar-classic', name: 'क्लासिक रेड', bg: 'bg-red-600' },
                  { id: 'crimson-festive', name: 'चाडपर्व रातो', bg: 'bg-rose-800' },
                  { id: 'royal-blue', name: 'रोयल ब्लु', bg: 'bg-blue-800' },
                  { id: 'mountain-emerald', name: 'हरियो इमेराल्ड', bg: 'bg-emerald-800' },
                  { id: 'sunset-terracotta', name: 'सनसेट अम्बर', bg: 'bg-amber-800' },
                  { id: 'minimal-slate', name: 'स्लेट मिनिमल', bg: 'bg-slate-800' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id as ThemeId)}
                    className={`p-2 rounded-xl border text-center text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      theme === th.id
                        ? 'border-red-600 ring-2 ring-red-500/20 font-bold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full ${th.bg} shadow-xs`}></div>
                    <span className="text-[11px] truncate w-full">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sans', label: 'आधुनिक सान्स (Sans)' },
                { id: 'serif', label: 'परम्परागत सेरिफ (Serif)' },
                { id: 'display', label: 'बोल्ड डिस्प्ले (Display)' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFontStyle(f.id as FontStyle)}
                  className={`py-2 px-2 text-center rounded-xl border text-xs cursor-pointer transition-all ${
                    fontStyle === f.id
                      ? 'border-red-600 bg-red-50 text-red-700 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* REQUIRED KHABAR GPT LOGO & FACEBOOK NAME NOTICE (NOT OPTIONAL) */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="p-4 bg-gradient-to-r from-red-50 via-slate-50 to-blue-50 rounded-2xl border-2 border-red-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      आधिकारिक ब्रान्डिङ तथा फेसबुक नाम (अनिवार्य / Required)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white tracking-wide flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>अनिवार्य (Locked)</span>
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  सबै पोस्टरहरूमा आधिकारिक <strong>खबर GPT लोगो</strong>, फेसबुक ब्याज <strong>(फेसबुक लोगो + {settings?.posterStudioSettings?.facebookHandle || 'KhabarGpt'})</strong> र वेबसाइट लिङ्क <strong>{settings?.posterStudioSettings?.websiteDisplay || 'khabargpt.onrender.com'}</strong> समावेश गरिएको छ।
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-600">
                  <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-bold text-slate-800">
                    लोगो: Khabar GPT Original
                  </span>
                  <span className="bg-white px-2 py-1 rounded-md border border-slate-200 text-blue-700 font-semibold">
                    फेसबुक: {settings?.posterStudioSettings?.facebookHandle || 'KhabarGpt'}
                  </span>
                  <span className="bg-white px-2 py-1 rounded-md border border-slate-200 text-red-700 font-semibold">
                    लिङ्क: {settings?.posterStudioSettings?.websiteDisplay || 'khabargpt.onrender.com'}
                  </span>
                </div>
              </div>

              {/* AI Disclaimer Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    सांकेतिक / AI चित्रण डिस्क्लेमर (Visual Disclaimer)
                  </span>
                  <span className="text-[11px] text-amber-700">
                    तस्बिर वास्तविक घटनाको नभई सांकेतिक भएको स्पष्ट पार्न यो सूचना राख्नुहोस्।
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiDisclaimer(!isAiDisclaimer)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    isAiDisclaimer ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Poster Preview & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>प्रत्यक्ष पूर्वावलोकन (Live Preview)</span>
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                {aspectRatio}
              </span>
            </div>

            {/* Canvas Container */}
            <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-[520px] object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'छवि तयार गरिँदै...' : 'पोस्टर डाउनलोड गर्नुहोस् (High-Res PNG)'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleShare}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{shareSuccess ? 'शेयर गरियो!' : 'डिभाइसमा शेयर'}</span>
                </button>

                <button
                  onClick={handleFacebookShare}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Facebook className="w-3.5 h-3.5 fill-white" />
                  <span>फेसबुकमा शेयर</span>
                </button>
              </div>

              {copied && (
                <div className="p-2.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>पोस्टरको विवरण र लिङ्क कपी गरियो!</span>
                </div>
              )}
            </div>

            {/* Transparency Note */}
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 space-y-1 leading-relaxed">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span>आधिकारिक ब्रान्डिङ तथा फेसबुक प्रमाणीकरण</span>
              </div>
              <p>
                प्रत्येक पोस्टरमा खबर GPT को आधिकारिक लोगो, फेसबुक <strong>(फेसबुक: {settings?.posterStudioSettings?.facebookHandle || 'KhabarGpt'})</strong> र वेबसाइट <strong>{settings?.posterStudioSettings?.websiteDisplay || 'khabargpt.onrender.com'}</strong> स्थायी रूपमा अंकित हुन्छ।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
