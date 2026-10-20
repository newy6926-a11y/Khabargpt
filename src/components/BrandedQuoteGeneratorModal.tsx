import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Sparkles,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Sliders,
  User,
  ShieldCheck
} from 'lucide-react';
import { SiteSettings } from '../types';

interface BrandedQuoteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SiteSettings;
  initialQuote?: string;
  initialSpeaker?: string;
  initialTitle?: string;
}

export const BrandedQuoteGeneratorModal: React.FC<BrandedQuoteGeneratorModalProps> = ({
  isOpen,
  onClose,
  settings,
  initialQuote = '',
  initialSpeaker = '',
  initialTitle = ''
}) => {
  const [quoteText, setQuoteText] = useState(
    initialQuote || 'नेपालको विकास र समृद्धिका लागि तथ्यपरक सूचना र नागरिक सचेतना नै सबैभन्दा ठूलो शक्ति हो।'
  );
  const [speakerName, setSpeakerName] = useState(initialSpeaker || 'सम्पादकीय भनाइ');
  const [speakerDesignation, setSpeakerDesignation] = useState(initialTitle || 'खबर GPT विश्लेषण डेस्क');
  const [categoryTag, setCategoryTag] = useState('विशेष टिप्पणी');
  const [theme, setTheme] = useState<'navy' | 'crimson' | 'emerald' | 'charcoal'>('navy');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '16:9'>('1:1');

  // Logo Customization for Cards
  const [logoMode, setLogoMode] = useState<'site' | 'custom' | 'emblem' | 'none'>('site');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(
    settings?.customCardLogoUrl || settings?.customLogoUrl || '/logo.svg'
  );
  const [watermarkHandle, setWatermarkHandle] = useState('@KhabarGPT');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.08);

  // Speaker Photo
  const [speakerPhotoUrl, setSpeakerPhotoUrl] = useState<string>('');

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const speakerFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync settings when opened
  useEffect(() => {
    if (settings?.customCardLogoUrl) {
      setCustomLogoUrl(settings.customCardLogoUrl);
    } else if (settings?.customLogoUrl) {
      setCustomLogoUrl(settings.customLogoUrl);
    }
  }, [settings]);

  // Redraw canvas on state changes
  useEffect(() => {
    if (!isOpen) return;
    drawCard();
  }, [
    isOpen,
    quoteText,
    speakerName,
    speakerDesignation,
    categoryTag,
    theme,
    aspectRatio,
    logoMode,
    customLogoUrl,
    watermarkHandle,
    watermarkOpacity,
    speakerPhotoUrl
  ]);

  const drawCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1080;
    let height = 1080;

    if (aspectRatio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (aspectRatio === '16:9') {
      width = 1200;
      height = 675;
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Background Fill
    if (theme === 'navy') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#090d16');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (theme === 'crimson') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#881337');
      grad.addColorStop(0.6, '#4c0519');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (theme === 'emerald') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(0.6, '#022c22');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Geometric Architectural Accents
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width - 100, 120, 360, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(100, height - 120, 280, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Central Brand Watermark (if opacity > 0)
    if (watermarkOpacity > 0 && watermarkHandle) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity})`;
      ctx.font = 'bold 72px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(watermarkHandle, width / 2, height / 2);
      ctx.restore();
    }

    // 4. Logo Rendering on Card (Top Left)
    const logoX = 80;
    const logoY = 80;
    const logoSize = 64;

    const renderTextBrand = (offset = 0) => {
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.font = 'bold 38px system-ui, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(settings?.siteTitle || 'खबर GPT', logoX + offset, logoY + 36);

      ctx.font = '500 20px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('तथ्यपरक र जिम्मेवार डिजिटल सूचना', logoX + offset, logoY + 66);
    };

    if (logoMode === 'site' || logoMode === 'custom') {
      const activeLogoSrc = logoMode === 'site' ? (settings?.customLogoUrl || '/logo.svg') : customLogoUrl;
      if (activeLogoSrc) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = activeLogoSrc;
          });

          if (img.complete && img.naturalWidth > 0) {
            // Draw circle container for logo
            ctx.save();
            ctx.beginPath();
            ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.clip();
            ctx.drawImage(img, logoX + 4, logoY + 4, logoSize - 8, logoSize - 8);
            ctx.restore();

            renderTextBrand(logoSize + 20);
          } else {
            // Fallback emblem box
            drawFallbackEmblem(ctx, logoX, logoY, logoSize);
            renderTextBrand(logoSize + 20);
          }
        } catch {
          drawFallbackEmblem(ctx, logoX, logoY, logoSize);
          renderTextBrand(logoSize + 20);
        }
      } else {
        drawFallbackEmblem(ctx, logoX, logoY, logoSize);
        renderTextBrand(logoSize + 20);
      }
    } else if (logoMode === 'emblem') {
      drawFallbackEmblem(ctx, logoX, logoY, logoSize);
      renderTextBrand(logoSize + 20);
    } else {
      // No logo - text only
      renderTextBrand(0);
    }

    // 5. Category / Tag Badge (Top Right)
    ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(width - 320, 85, 240, 52, 26);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(categoryTag, width - 200, 118);

    // 6. Quotation Marks Graphic
    const quoteMarkY = aspectRatio === '9:16' ? 380 : aspectRatio === '16:9' ? 220 : 280;
    ctx.font = 'bold 150px serif';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.textAlign = 'left';
    ctx.fillText('“', 80, quoteMarkY);

    // 7. Multi-line Quote Text
    const maxWidth = width - 160;
    const startY = quoteMarkY + 30;
    const lineHeight = aspectRatio === '16:9' ? 52 : 68;
    const fontSize = aspectRatio === '16:9' ? '36px' : '44px';

    ctx.fillStyle = '#f8fafc';
    ctx.font = `600 ${fontSize} system-ui, sans-serif`;
    ctx.textAlign = 'left';

    const words = quoteText.split(' ');
    let line = '';
    let y = startY;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), 80, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 80, y);

    // 8. Divider Line
    const dividerY = Math.max(y + 60, height - (aspectRatio === '16:9' ? 140 : 200));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, dividerY);
    ctx.lineTo(width - 80, dividerY);
    ctx.stroke();

    // 9. Speaker Info Zone (Bottom)
    const speakerY = dividerY + 35;
    const avatarX = 80;
    const avatarRadius = aspectRatio === '16:9' ? 36 : 45;

    // Check if custom speaker photo provided
    if (speakerPhotoUrl) {
      try {
        const photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        await new Promise<void>((res) => {
          photoImg.onload = () => res();
          photoImg.onerror = () => res();
          photoImg.src = speakerPhotoUrl;
        });

        if (photoImg.complete && photoImg.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(avatarX + avatarRadius, speakerY + avatarRadius, avatarRadius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(photoImg, avatarX, speakerY, avatarRadius * 2, avatarRadius * 2);
          ctx.restore();
        } else {
          drawFallbackAvatar(ctx, avatarX, speakerY, avatarRadius, speakerName);
        }
      } catch {
        drawFallbackAvatar(ctx, avatarX, speakerY, avatarRadius, speakerName);
      }
    } else {
      drawFallbackAvatar(ctx, avatarX, speakerY, avatarRadius, speakerName);
    }

    // Outer border for avatar
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(avatarX + avatarRadius, speakerY + avatarRadius, avatarRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Speaker Name & Designation text
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `bold ${aspectRatio === '16:9' ? '30px' : '36px'} system-ui, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(speakerName, avatarX + avatarRadius * 2 + 25, speakerY + avatarRadius - 5);

    ctx.font = `500 ${aspectRatio === '16:9' ? '20px' : '24px'} system-ui, sans-serif`;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(speakerDesignation, avatarX + avatarRadius * 2 + 25, speakerY + avatarRadius + 30);

    // 10. Official Verification Stamp & Date (Bottom Right)
    const todayNp = new Date().toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    ctx.textAlign = 'right';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('✓ आधिकारिक खबर GPT कार्ड', width - 80, speakerY + avatarRadius - 5);

    ctx.font = '400 20px system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(todayNp, width - 80, speakerY + avatarRadius + 28);
  };

  const drawFallbackEmblem = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 14);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ख', x + size / 2, y + size / 2);
  };

  const drawFallbackAvatar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    name: string
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.fill();
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 34px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.charAt(0) || 'ख', x + radius, y + radius);
    ctx.restore();
  };

  // Upload Custom Logo file for card
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomLogoUrl(reader.result as string);
      setLogoMode('custom');
    };
    reader.readAsDataURL(file);
  };

  // Upload Speaker Photo
  const handleSpeakerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSpeakerPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      const safeFilename = (speakerName || 'khabargpt-quote')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      a.download = `khabar-gpt-card-${safeFilename || 'quote'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          await navigator.clipboard.writeText(
            `"${quoteText}" — ${speakerName} (${speakerDesignation}) | खबर GPT`
          );
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      });
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                सोसियल मिडिया कोट & कार्ड जेनेरेटर (Branded Social Card Generator)
              </h3>
              <p className="text-xs text-slate-500">
                फेसबुक, इन्स्टाग्राम र एक्स (Twitter) का लागि खबर GPT ब्राण्डेड कार्ड र कस्टम लोगो व्यवस्थापन
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Side */}
          <div className="lg:col-span-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
            {/* Quote Text */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                भनाइ / उद्धरण व्यहोरा (Quote Text) *
              </label>
              <textarea
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-slate-800 text-xs"
                placeholder="यहाँ भनाइ वा उद्धरण लेख्नुहोस्..."
              />
            </div>

            {/* Speaker Name & Title */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">वक्ताको नाम (Speaker)</label>
                <input
                  type="text"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">पद / परिचय (Designation)</label>
                <input
                  type="text"
                  value={speakerDesignation}
                  onChange={(e) => setSpeakerDesignation(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 text-slate-800"
                />
              </div>
            </div>

            {/* Speaker Photo */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  वक्ताको फोटो (Speaker Photo)
                </span>
                {speakerPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setSpeakerPhotoUrl('')}
                    className="text-[10px] text-red-600 hover:underline cursor-pointer"
                  >
                    फोटो हटाउनुहोस्
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={speakerFileInputRef}
                  onChange={handleSpeakerPhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => speakerFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>फोटो छान्नुहोस्</span>
                </button>
                <input
                  type="text"
                  value={speakerPhotoUrl}
                  onChange={(e) => setSpeakerPhotoUrl(e.target.value)}
                  placeholder="वा फोटोको URL राख्नुहोस्"
                  className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-[11px] bg-white"
                />
              </div>
            </div>

            {/* CARD LOGO CUSTOMIZER (Addressing user request!) */}
            <div className="p-3 bg-red-50/40 border border-red-200/80 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-red-600" />
                  कार्ड लोगो व्यवस्थापन (Card Logo Customizer)
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                  स्वतन्त्र लोगो
                </span>
              </div>

              {/* Logo Mode Radio Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLogoMode('site')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    logoMode === 'site'
                      ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  साइट लोगो
                </button>
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    logoMode === 'custom'
                      ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  नयाँ लोगो
                </button>
                <button
                  type="button"
                  onClick={() => setLogoMode('emblem')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    logoMode === 'emblem'
                      ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  'ख' चिन्ह
                </button>
                <button
                  type="button"
                  onClick={() => setLogoMode('none')}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold text-center border transition-all cursor-pointer ${
                    logoMode === 'none'
                      ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  बिना लोगो
                </button>
              </div>

              {/* Upload file input */}
              <input
                type="file"
                ref={logoFileInputRef}
                onChange={handleLogoUpload}
                accept=".svg,.png,.jpg,.jpeg,.webp"
                className="hidden"
              />

              {logoMode === 'custom' && (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={customLogoUrl}
                    onChange={(e) => setCustomLogoUrl(e.target.value)}
                    placeholder="कस्टम लोगो URL वा माथिको बटनबाट फाइल अपलोड गर्नुहोस्"
                    className="w-full px-2.5 py-1.5 border border-red-200 rounded-lg text-[11px] bg-white font-mono"
                  />
                </div>
              )}

              {/* Watermark Handle & Opacity */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-red-100">
                <div>
                  <label className="text-[10px] text-slate-600 block mb-0.5">वाटरमार्क ह्यान्डल</label>
                  <input
                    type="text"
                    value={watermarkHandle}
                    onChange={(e) => setWatermarkHandle(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-[11px] bg-white"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                    <span>पारदर्शिता</span>
                    <span>{Math.round(watermarkOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.3"
                    step="0.02"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full accent-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Category Tag, Theme & Aspect Ratio */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">विषय ट्याग</label>
                <input
                  type="text"
                  value={categoryTag}
                  onChange={(e) => setCategoryTag(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">रङ थिम</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white"
                >
                  <option value="navy">नेभी ब्लु (Navy)</option>
                  <option value="crimson">सिम्रिक (Crimson)</option>
                  <option value="emerald">ग्रिन (Emerald)</option>
                  <option value="charcoal">चारकोल (Black)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">अनुपात (Size)</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-slate-800 bg-white"
                >
                  <option value="1:1">१:१ (Post)</option>
                  <option value="9:16">९:१६ (Story)</option>
                  <option value="16:9">१६:९ (Twitter)</option>
                </select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'डाउनलोड हुँदैछ...' : 'कार्ड डाउनलोड (PNG)'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyToClipboard}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs shadow-xs"
                title="प्रतिलिपि गर्नुहोस्"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'कपि भयो!' : 'कपि'}</span>
              </button>
            </div>
          </div>

          {/* Canvas Live Preview Side */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-100 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between w-full mb-2 text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                प्रत्यक्ष पूर्वावलोकन (Live Graphic Canvas)
              </span>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono">
                {aspectRatio === '1:1' ? '1080 × 1080' : aspectRatio === '9:16' ? '1080 × 1920' : '1200 × 675'}
              </span>
            </div>

            <div className="w-full flex items-center justify-center p-2 overflow-hidden max-h-[500px]">
              <canvas
                ref={canvasRef}
                className="max-h-[460px] max-w-full rounded-xl shadow-lg border border-slate-300 object-contain"
              />
            </div>

            <span className="text-[10px] text-slate-500 mt-2 text-center">
              फेसबुक, इन्स्टाग्राम, ह्वाट्सएप वा एक्समा सेयर गर्न डाउनलोड गर्नुहोस्।
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
