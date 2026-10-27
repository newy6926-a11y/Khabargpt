import React, { useState, useRef, useEffect } from 'react';
import { SiteSettings, PosterStudioConfig, MediaItem } from '../types';
import { api } from '../services/api';
import {
  Palette,
  CheckCircle,
  Save,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Upload,
  Eye,
  ShieldCheck,
  Facebook,
  Globe,
  Tag,
  Check,
  FolderOpen,
  Info
} from 'lucide-react';

interface AdminPosterStudioPanelProps {
  settings: SiteSettings;
  onSettingsUpdate: (settings: SiteSettings) => void;
  showNotification?: (msg: string, type?: 'success' | 'error') => void;
  onNavigateToStudio?: () => void;
}

export const AdminPosterStudioPanel: React.FC<AdminPosterStudioPanelProps> = ({
  settings,
  onSettingsUpdate,
  showNotification,
  onNavigateToStudio
}) => {
  const currentConfig: PosterStudioConfig = settings.posterStudioSettings || {
    customLogoUrl: settings.customLogoUrl || '/logo.png',
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

  // Form State
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(currentConfig.customLogoUrl || '/logo.png');
  const [topLogoPosition, setTopLogoPosition] = useState<'none' | 'top-left' | 'top-center' | 'top-right'>(
    currentConfig.topLogoPosition || 'top-left'
  );
  const [topLogoSize, setTopLogoSize] = useState<'small' | 'medium' | 'large'>(
    currentConfig.topLogoSize || 'medium'
  );
  const [bottomLogoStyle, setBottomLogoStyle] = useState<'circle-white' | 'transparent' | 'glow'>(
    currentConfig.bottomLogoStyle || 'circle-white'
  );
  const [facebookHandle, setFacebookHandle] = useState<string>(
    currentConfig.facebookHandle || 'KhabarGpt'
  );
  const [showFacebookBadge, setShowFacebookBadge] = useState<boolean>(
    currentConfig.showFacebookBadge ?? true
  );
  const [brandTitle, setBrandTitle] = useState<string>(
    currentConfig.brandTitle || 'खबर GPT (Khabar GPT)'
  );
  const [websiteDisplay, setWebsiteDisplay] = useState<string>(
    currentConfig.websiteDisplay || 'khabargpt.onrender.com'
  );
  const [footerTagline, setFooterTagline] = useState<string>(
    currentConfig.footerTagline || 'डिजिटल पोस्टर स्टुडियो · आधिकारिक पोर्टल'
  );
  const [defaultTheme, setDefaultTheme] = useState<string>(
    currentConfig.defaultTheme || 'khabar-classic'
  );
  const [defaultAspectRatio, setDefaultAspectRatio] = useState<'1:1' | '4:5' | '16:9'>(
    currentConfig.defaultAspectRatio || '1:1'
  );
  const [showWatermark, setShowWatermark] = useState<boolean>(
    currentConfig.showWatermark ?? true
  );
  const [showAiDisclaimer, setShowAiDisclaimer] = useState<boolean>(
    currentConfig.showAiDisclaimer ?? false
  );
  const [disclaimerText, setDisclaimerText] = useState<string>(
    currentConfig.disclaimerText || '⚠️ नोट: यो सामग्री/चित्रण सांकेतिक हो, प्रत्यक्ष आधिकारिक समाचार तस्बिर होइन।'
  );

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load media items
  useEffect(() => {
    api.getMedia().then(setMediaList).catch(() => {});
  }, []);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    if (showNotification) {
      showNotification(msg, type);
    }
  };

  // Redraw preview canvas whenever settings change
  useEffect(() => {
    drawPreviewCanvas();
  }, [
    customLogoUrl,
    topLogoPosition,
    topLogoSize,
    bottomLogoStyle,
    facebookHandle,
    showFacebookBadge,
    brandTitle,
    websiteDisplay,
    footerTagline,
    defaultTheme,
    defaultAspectRatio,
    showWatermark,
    showAiDisclaimer,
    disclaimerText
  ]);

  const drawPreviewCanvas = async () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 600;
    const height = defaultAspectRatio === '16:9' ? 338 : defaultAspectRatio === '4:5' ? 750 : 600;
    canvas.width = width;
    canvas.height = height;

    // Theme Colors
    let bgGradStart = '#0f172a';
    let bgGradEnd = '#020617';
    let primaryAccent = '#dc2626';
    let secondaryAccent = '#f59e0b';
    let cardBg = 'rgba(255, 255, 255, 0.05)';
    let cardBorder = 'rgba(255, 255, 255, 0.12)';

    if (defaultTheme === 'crimson-festive') {
      bgGradStart = '#7f1d1d';
      bgGradEnd = '#450a0a';
      primaryAccent = '#f59e0b';
      secondaryAccent = '#fde047';
      cardBg = 'rgba(0, 0, 0, 0.25)';
      cardBorder = 'rgba(245, 158, 11, 0.3)';
    } else if (defaultTheme === 'royal-blue') {
      bgGradStart = '#1e3a8a';
      bgGradEnd = '#0f172a';
      primaryAccent = '#38bdf8';
      secondaryAccent = '#fbbf24';
      cardBg = 'rgba(255, 255, 255, 0.06)';
      cardBorder = 'rgba(56, 189, 248, 0.25)';
    } else if (defaultTheme === 'mountain-emerald') {
      bgGradStart = '#064e3b';
      bgGradEnd = '#022c22';
      primaryAccent = '#34d399';
      secondaryAccent = '#fef08a';
      cardBg = 'rgba(255, 255, 255, 0.06)';
      cardBorder = 'rgba(52, 211, 153, 0.25)';
    } else if (defaultTheme === 'sunset-terracotta') {
      bgGradStart = '#7c2d12';
      bgGradEnd = '#431407';
      primaryAccent = '#fb923c';
      secondaryAccent = '#fef08a';
      cardBg = 'rgba(0, 0, 0, 0.3)';
      cardBorder = 'rgba(251, 146, 60, 0.3)';
    } else if (defaultTheme === 'minimal-slate') {
      bgGradStart = '#1e293b';
      bgGradEnd = '#0f172a';
      primaryAccent = '#e2e8f0';
      secondaryAccent = '#38bdf8';
      cardBg = 'rgba(255, 255, 255, 0.04)';
      cardBorder = 'rgba(255, 255, 255, 0.1)';
    }

    // 1. Background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, bgGradStart);
    grad.addColorStop(1, bgGradEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative inner frame
    ctx.strokeStyle = cardBorder;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Pre-load Logo Image
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    await new Promise<void>((resolve) => {
      logoImg.onload = () => resolve();
      logoImg.onerror = () => resolve();
      logoImg.src = customLogoUrl || '/logo.png';
    });

    const fontFamily = '"Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif';

    // 2. Render Top Header Logo if enabled
    if (topLogoPosition !== 'none') {
      const pxSize = topLogoSize === 'small' ? 36 : topLogoSize === 'large' ? 56 : 46;
      let topLogoX = 32;
      const topLogoY = 28;

      if (topLogoPosition === 'top-center') {
        topLogoX = (width - pxSize) / 2;
      } else if (topLogoPosition === 'top-right') {
        topLogoX = width - pxSize - 32;
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

      // Top logo subtle label if top-left or top-right
      if (topLogoPosition === 'top-left') {
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold 13px ${fontFamily}`;
        ctx.textAlign = 'left';
        ctx.fillText('खबर GPT', topLogoX + pxSize + 8, topLogoY + pxSize / 2 + 4);
      }
    }

    // Category / Title Badge
    ctx.fillStyle = primaryAccent;
    ctx.font = `600 12px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText('विशेष डिजिटल सन्देश (Sample Poster)', width / 2, topLogoPosition === 'top-center' ? 100 : 50);

    // Main Sample Card Box
    const cardMarginX = 30;
    const cardWidth = width - cardMarginX * 2;
    const brandBandHeight = 64;
    const brandBandY = height - brandBandHeight - 20;
    const cardTop = topLogoPosition === 'top-center' ? 120 : 75;
    const cardHeight = brandBandY - cardTop - 15;

    ctx.fillStyle = cardBg;
    ctx.strokeStyle = cardBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cardMarginX, cardTop, cardWidth, cardHeight, 14);
    ctx.fill();
    ctx.stroke();

    // Sample Headline Text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 20px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText('नेपालका समसामयिक विषय र जानकारी', width / 2, cardTop + 55);

    ctx.fillStyle = secondaryAccent;
    ctx.font = `500 13px ${fontFamily}`;
    ctx.fillText('तथ्यपरक, निष्पक्ष र जिम्मेवार डिजिटल सूचना पोर्टल', width / 2, cardTop + 90);

    // Verification Watermark Stamp
    if (showWatermark) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      const stampW = 160;
      const stampH = 26;
      const stampX = width / 2 - stampW / 2;
      const stampY = cardTop + cardHeight - 40;
      ctx.beginPath();
      ctx.roundRect(stampX, stampY, stampW, stampH, 13);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = `bold 10px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText('✓ आधिकारिक खबर GPT कार्ड', width / 2, stampY + 16);
    }

    // AI disclaimer if enabled
    if (showAiDisclaimer) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = `italic 9px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(disclaimerText, width / 2, brandBandY - 5);
    }

    // 3. REQUIRED BRAND BAND (Bottom Capsule)
    const bandMargin = 30;
    const bandWidth = width - bandMargin * 2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.strokeStyle = cardBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bandMargin, brandBandY, bandWidth, brandBandHeight, 12);
    ctx.fill();
    ctx.stroke();

    // Draw Bottom Logo
    const bLogoSize = 44;
    const bLogoX = bandMargin + 10;
    const bLogoY = brandBandY + (brandBandHeight - bLogoSize) / 2;

    if (bottomLogoStyle === 'circle-white') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(bLogoX + bLogoSize / 2, bLogoY + bLogoSize / 2, bLogoSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.clip();
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, bLogoX + 2, bLogoY + 2, bLogoSize - 4, bLogoSize - 4);
      }
      ctx.restore();
    } else if (bottomLogoStyle === 'glow') {
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, bLogoX, bLogoY, bLogoSize, bLogoSize);
      }
      ctx.restore();
    } else {
      // transparent
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, bLogoX, bLogoY, bLogoSize, bLogoSize);
      }
    }

    // Text on Brand Band
    const textLeft = bLogoX + bLogoSize + 12;
    const bandCenterY = brandBandY + brandBandHeight / 2;

    // Brand Name
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 14px ${fontFamily}`;
    ctx.fillText(brandTitle, textLeft, bandCenterY - 4);

    // Facebook Badge: Official Facebook Logo + KhabarGpt (NOT facebook.com/khabargpt!)
    if (showFacebookBadge) {
      const fbIconRadius = 8;
      const fbIconCenterX = textLeft + fbIconRadius;
      const fbIconCenterY = bandCenterY + 14;

      // Facebook Blue Circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(fbIconCenterX, fbIconCenterY, fbIconRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#1877F2';
      ctx.fill();

      // White 'f' inside
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('f', fbIconCenterX + 0.8, fbIconCenterY + 0.8);
      ctx.restore();

      // Handle Text
      ctx.fillStyle = '#e0f2fe';
      ctx.font = `bold 12px ${fontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(facebookHandle, fbIconCenterX + fbIconRadius + 6, fbIconCenterY);
    }

    // Right side: Website Display URL
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f87171';
    ctx.font = `bold 12px ${fontFamily}`;
    ctx.fillText(websiteDisplay, bandMargin + bandWidth - 12, bandCenterY - 4);

    ctx.fillStyle = '#94a3b8';
    ctx.font = `normal 9px ${fontFamily}`;
    ctx.fillText(footerTagline, bandMargin + bandWidth - 12, bandCenterY + 14);
  };

  // Upload Custom Poster Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('कृपया तस्बिर मात्र अपलोड गर्नुहोस् (PNG वा JPG)', 'error');
      return;
    }

    setUploadingLogo(true);
    try {
      const uploaded = await api.uploadMedia(file);
      setCustomLogoUrl(uploaded.url);
      notify('✅ नयाँ पोस्टर लोगो सफलतापूर्वक अपलोड भयो!');
    } catch {
      notify('लोगो अपलोड गर्दा समस्या आयो। पुनः प्रयास गर्नुहोस्।', 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Save Settings to Backend
  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedConfig: PosterStudioConfig = {
        customLogoUrl,
        topLogoPosition,
        topLogoSize,
        bottomLogoStyle,
        facebookHandle: facebookHandle.trim() || 'KhabarGpt',
        showFacebookBadge,
        brandTitle: brandTitle.trim() || 'खबर GPT (Khabar GPT)',
        websiteDisplay: websiteDisplay.trim() || 'khabargpt.onrender.com',
        footerTagline: footerTagline.trim() || 'डिजिटल पोस्टर स्टुडियो · आधिकारिक पोर्टल',
        defaultTheme,
        defaultAspectRatio,
        showWatermark,
        showAiDisclaimer,
        disclaimerText
      };

      const newSettings: SiteSettings = {
        ...settings,
        posterStudioSettings: updatedConfig
      };

      await api.updateSettings(newSettings);
      onSettingsUpdate(newSettings);
      notify('🎉 फोटो तथा पोस्टर स्टुडियो सेटिङहरू सफलतापूर्वक सुरक्षित गरियो!');
    } catch {
      notify('सेटिङ सुरक्षित गर्न सकिएन। पुनः प्रयास गर्नुहोस्।', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setCustomLogoUrl('/logo.png');
    setTopLogoPosition('top-left');
    setTopLogoSize('medium');
    setBottomLogoStyle('circle-white');
    setFacebookHandle('KhabarGpt');
    setShowFacebookBadge(true);
    setBrandTitle('खबर GPT (Khabar GPT)');
    setWebsiteDisplay('khabargpt.onrender.com');
    setFooterTagline('डिजिटल पोस्टर स्टुडियो · आधिकारिक पोर्टल');
    setDefaultTheme('khabar-classic');
    setDefaultAspectRatio('1:1');
    setShowWatermark(true);
    setShowAiDisclaimer(false);
    notify('पुनर्स्थापित गरियो। सुरक्षित गर्न तलको सेभ बटन थिच्नुहोस्।');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold">
            <Palette className="w-3.5 h-3.5" />
            <span>पोस्टर तथा फोटो स्टुडियो नियन्त्रण कक्ष</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-sans">
            फोटो & पोस्टर स्टुडियो व्यवस्थापन (Photo & Poster Studio Management)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            वेबसाइट तथा सामाजिक सञ्जालका लागि सिर्जना गरिने पोस्टरहरूमा आधिकारिक लोगो, फेसबुक ब्रान्डिङ, वाटरमार्क, र डिजाइन ढाँचा पूर्ण रूपमा अनुकूलन गर्नुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onNavigateToStudio && (
            <button
              onClick={onNavigateToStudio}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-blue-400" />
              <span>स्टुडियो खोल्नुहोस्</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'सुरक्षित हुँदै...' : 'सेटिङहरू सुरक्षित गर्नुहोस्'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Official Logo Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
                <ImageIcon className="w-5 h-5 text-red-600" />
                <span>१. पोस्टरमा आधिकारिक लोगो (Khabar GPT Logo on Poster)</span>
              </div>
              <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 font-bold px-2 py-0.5 rounded-full">
                सक्रिय
              </span>
            </div>

            {/* Logo Image Preview & Source */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                <img
                  src={customLogoUrl}
                  alt="Poster Logo"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  लोगो URL वा अपलोड (Logo URL or Direct Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLogoUrl}
                    onChange={(e) => setCustomLogoUrl(e.target.value)}
                    placeholder="/logo.png वा https://..."
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingLogo ? 'अपलोड हुँदै...' : 'अपलोड'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(!showMediaPicker)}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>मिडिया ग्यालरीबाट छान्नुहोस्</span>
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={() => setCustomLogoUrl('/logo.png')}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    आधिकारिक /logo.png राख्नुहोस्
                  </button>
                </div>
              </div>
            </div>

            {/* Media Gallery Picker Drawer */}
            {showMediaPicker && (
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2 max-h-48 overflow-y-auto">
                <span className="text-xs font-bold text-slate-700 block">ग्यालरीबाट लोगो छान्नुहोस्:</span>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {mediaList
                    .filter((m) => m.mimeType.startsWith('image/'))
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCustomLogoUrl(item.url);
                          setShowMediaPicker(false);
                          notify('लोगो परिवर्तन भयो!');
                        }}
                        className={`p-1 bg-white border rounded-lg hover:border-red-500 cursor-pointer overflow-hidden transition-all ${
                          customLogoUrl === item.url ? 'ring-2 ring-red-500 border-red-500' : 'border-slate-200'
                        }`}
                      >
                        <img src={item.url} alt={item.originalName} className="w-full h-12 object-contain" />
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Top Logo Position & Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  माथिल्लो हेडरमा लोगो स्थिति (Top Header Logo)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'top-left', label: 'माथि बायाँ (Left)' },
                    { id: 'top-center', label: 'माथि बीचमा (Center)' },
                    { id: 'top-right', label: 'माथि दायाँ (Right)' },
                    { id: 'none', label: 'शीर्षमा नदेखाउने' }
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setTopLogoPosition(pos.id as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left cursor-pointer transition-all ${
                        topLogoPosition === pos.id
                          ? 'bg-red-50 border-red-500 text-red-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  माथिल्लो लोगोको आकार (Top Logo Size)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'small', label: 'सानो (Small)' },
                    { id: 'medium', label: 'मध्यम (Medium)' },
                    { id: 'large', label: 'ठूलो (Large)' }
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setTopLogoSize(sz.id as any)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border text-center cursor-pointer transition-all ${
                        topLogoSize === sz.id
                          ? 'bg-red-50 border-red-500 text-red-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Brand Band Logo Style */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                तल्लो ब्रान्ड ब्यान्डमा लोगो ढाँचा (Bottom Band Logo Style)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'circle-white', title: 'सेतो वृत्त ब्याज', desc: 'सफा वृत्ताकार सेतो पृष्ठभूमि' },
                  { id: 'transparent', title: 'पारदर्शी (Transparent)', desc: 'डायरेक्ट लोगो (सिमलेस PNG)' },
                  { id: 'glow', title: 'हल्का आधुनिक ग्लो', desc: 'आधुनिक सफ्ट नियोन प्रभाव' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setBottomLogoStyle(st.id as any)}
                    className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                      bottomLogoStyle === st.id
                        ? 'bg-red-50 border-red-500 ring-1 ring-red-400'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-800">{st.title}</span>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">{st.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Social & Facebook Branding */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
                <Facebook className="w-5 h-5 text-blue-600" />
                <span>२. फेसबुक तथा सामाजिक ब्रान्डिङ (Facebook & Social Badges)</span>
              </div>
            </div>

            {/* Clarification banner */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>आधुनिक फेसबुक ब्याज ढाँचा:</span>
              </div>
              <p className="leading-relaxed">
                प्रयोगकर्ताको अनुरोध अनुसार, पोस्टरमा अब <code>facebook.com/khabargpt</code> को साटो आधिकारिक <strong>फेसबुक लोगो</strong> र केवल तपाईंको पेजको नाम <strong>KhabarGpt</strong> सफा र आधुनिक तरिकाले प्रस्तुत गरिन्छ।
              </p>
            </div>

            <div className="space-y-3">
              {/* Facebook Badge Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <span className="block text-xs font-bold text-slate-800">
                    पोस्टरमा फेसबुक ब्याज देखाउने (Show Facebook Badge)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    आधिकारिक फेसबुक लोगो + पेज नाम तलको ब्रान्ड ब्यान्डमा देखाउँछ
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showFacebookBadge}
                  onChange={(e) => setShowFacebookBadge(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded cursor-pointer"
                />
              </div>

              {/* Facebook Handle Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  फेसबुक पेज नाम / ह्यान्डल (Facebook Handle Text)
                </label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    f
                  </div>
                  <input
                    type="text"
                    value={facebookHandle}
                    onChange={(e) => setFacebookHandle(e.target.value)}
                    placeholder="उदा: KhabarGpt"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  पोस्टरमा देखिने अक्षर: फेसबुक लोगो + {facebookHandle}
                </span>
              </div>

              {/* Brand Title and Website URL Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    आधिकारिक ब्रान्ड नाम (Brand Title on Poster)
                  </label>
                  <input
                    type="text"
                    value={brandTitle}
                    onChange={(e) => setBrandTitle(e.target.value)}
                    placeholder="उदा: खबर GPT (Khabar GPT)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    वेबसाइट प्रदर्शन ठेगाना (Website Display Text)
                  </label>
                  <input
                    type="text"
                    value={websiteDisplay}
                    onChange={(e) => setWebsiteDisplay(e.target.value)}
                    placeholder="उदा: khabargpt.onrender.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  तल्लो पोर्टल ट्यागलाइन (Footer Tagline)
                </label>
                <input
                  type="text"
                  value={footerTagline}
                  onChange={(e) => setFooterTagline(e.target.value)}
                  placeholder="उदा: डिजिटल पोस्टर स्टुडियो · आधिकारिक पोर्टल"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Themes & Defaults */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">
              <Sliders className="w-5 h-5 text-purple-600" />
              <span>३. पूर्वनिर्धारित ढाँचा तथा थिम (Default Themes & Rules)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  पूर्वनिर्धारित आकार (Default Aspect Ratio)
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: '1:1', label: '१:१ (Square - फेसबुक/इन्स्टा पोस्ट)' },
                    { id: '4:5', label: '४:५ (Portrait - मोबाइल फिड)' },
                    { id: '16:9', label: '१६:९ (Landscape - कभर/ल्यान्डस्केप)' }
                  ].map((asp) => (
                    <button
                      key={asp.id}
                      type="button"
                      onClick={() => setDefaultAspectRatio(asp.id as any)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium border text-left cursor-pointer transition-all ${
                        defaultAspectRatio === asp.id
                          ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {asp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  पूर्वनिर्धारित रङ थिम (Default Theme)
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'khabar-classic', label: 'डार्क क्लासिक (Khabar Classic Dark)' },
                    { id: 'royal-blue', label: 'शाही निलो (Royal Blue)' },
                    { id: 'crimson-festive', label: 'चाडपर्व रातो (Crimson Festive)' },
                    { id: 'mountain-emerald', label: 'हिमाली हरियो (Mountain Emerald)' },
                    { id: 'sunset-terracotta', label: 'सुर्यास्त सुन्तला (Sunset)' },
                    { id: 'minimal-slate', label: 'स्लेट ग्रे (Minimal Slate)' }
                  ].map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setDefaultTheme(th.id)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium border text-left cursor-pointer transition-all ${
                        defaultTheme === th.id
                          ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Watermark & AI disclaimer */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span className="text-xs font-bold text-slate-800">
                  पोस्टरमा '✓ आधिकारिक खबर GPT कार्ड' प्रमाणीकरण ब्याज देखाउने
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAiDisclaimer}
                  onChange={(e) => setShowAiDisclaimer(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span className="text-xs font-bold text-slate-800">
                  AI सांकेतिक तस्बिर सम्बन्धी सचेतना सूचना (Disclaimer) देखाउने
                </span>
              </label>

              {showAiDisclaimer && (
                <div className="pl-6 pt-1">
                  <input
                    type="text"
                    value={disclaimerText}
                    onChange={(e) => setDisclaimerText(e.target.value)}
                    placeholder="डिस्क्लेमर वाक्य"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Eye className="w-4 h-4 text-red-600" />
                <span>प्रत्यक्ष अन्तरक्रियात्मक पूर्वावलोकन (Live Canvas)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {defaultAspectRatio}
              </span>
            </div>

            {/* Live Canvas */}
            <div className="bg-slate-950 p-2 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800 shadow-inner">
              <canvas
                ref={previewCanvasRef}
                className="max-w-full h-auto rounded-lg shadow-lg block"
                style={{ maxHeight: '460px' }}
              />
            </div>

            {/* Live highlights list */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-1.5">
              <span className="font-bold text-slate-900 block">वर्तमान पोस्टर ब्रान्डिङ स्थिति:</span>
              <div className="flex items-center gap-2 text-[11px]">
                <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>शीर्ष लोगो: <strong>{topLogoPosition === 'none' ? 'बन्द' : `${topLogoPosition} (${topLogoSize})`}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>फेसबुक ब्याज: <strong>{showFacebookBadge ? `फेसबुक लोगो + ${facebookHandle}` : 'बन्द'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>तल्लो लोगो: <strong>{bottomLogoStyle}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>वेबसाइट लिङ्क: <strong>{websiteDisplay}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'सुरक्षित गरिँदै...' : 'सबै पोस्टर सेटिङहरू सुरक्षित गर्नुहोस्'}</span>
              </button>

              <button
                onClick={handleReset}
                type="button"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पूर्वनिर्धारितमा रिसेट गर्नुहोस् (Reset Defaults)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
