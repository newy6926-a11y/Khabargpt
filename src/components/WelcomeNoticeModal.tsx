import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import {
  X,
  ExternalLink,
  BellRing,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Facebook
} from 'lucide-react';

interface WelcomeNoticeModalProps {
  settings?: SiteSettings;
  onNavigate?: (path: string) => void;
}

export const WelcomeNoticeModal: React.FC<WelcomeNoticeModalProps> = ({
  settings,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!settings || !settings.entryPopupActive) {
      setIsOpen(false);
      return;
    }

    // Check if dismissed in this session (unless admin configured to show always)
    if (!settings.entryPopupShowAlways) {
      const dismissed = sessionStorage.getItem('khabar_welcome_notice_dismissed');
      if (dismissed === 'true') {
        return;
      }
    }

    // Short pleasant delay to let website background paint first
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [settings?.entryPopupActive, settings?.entryPopupShowAlways]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('khabar_welcome_notice_dismissed', 'true');
  };

  const handleActionClick = () => {
    handleDismiss();
    if (settings?.entryPopupButtonLink) {
      if (settings.entryPopupButtonLink.startsWith('/') && onNavigate) {
        onNavigate(settings.entryPopupButtonLink);
      } else {
        window.open(settings.entryPopupButtonLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  if (!isOpen || !settings?.entryPopupActive) return null;

  const title = settings.entryPopupTitle || 'आधिकारिक सूचना (Official Notice)';
  const message = settings.entryPopupMessage || '';
  const imageUrl = settings.entryPopupImageUrl || '/official-notice.svg';
  const videoUrl = settings.entryPopupVideoUrl;
  const facebookUrl = settings.facebookUrl || 'https://facebook.com/khabargpt';

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      >
        <div className="bg-white rounded-3xl max-w-xl sm:max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
          {/* Top Header Bar */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-3.5 flex items-center justify-between gap-3 shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 block">
                  आधिकारिक सूचना (Official Notice)
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white truncate">
                  {title}
                </h3>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="सूचना बन्द गर्नुहोस्"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 text-sm">
            {/* Direct Video Media */}
            {videoUrl && (
              <div className="rounded-2xl overflow-hidden bg-black border border-slate-200 aspect-video shadow-xs">
                {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={
                      videoUrl.includes('embed')
                        ? videoUrl
                        : `https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop()}?autoplay=1&mute=1`
                    }
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    muted
                    playsInline
                    loop
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            )}

            {/* Direct Photo Media - CLICKABLE TO SHOW FULL UNCOMPRESSED IMAGE */}
            {!videoUrl && imageUrl && (
              <div className="space-y-3">
                <div
                  onClick={() => {
                    setIsZoomed(true);
                    setZoomLevel(1);
                  }}
                  className="rounded-2xl overflow-hidden bg-white border-2 border-slate-200 hover:border-red-400 shadow-md flex flex-col items-center justify-center relative group cursor-pointer transition-all"
                  title="पूरा तस्बिर हेर्न यहाँ थिच्नुहोस् (Click to view full uncropped image)"
                >
                  <img
                    src={imageUrl}
                    alt={title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/official-notice.svg';
                    }}
                    className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-[1.008]"
                  />

                  {/* Visual Indicator Overlay on Hover */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-slate-900/90 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-xs">
                      <Maximize2 className="w-4 h-4 text-red-400" />
                      <span>पूरा तस्बिर हेर्न थिच्नुहोस् (Click for Full View)</span>
                    </span>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute bottom-2.5 right-2.5 bg-slate-950/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md pointer-events-none">
                    <Maximize2 className="w-3 h-3 text-red-400" />
                    <span>पूरा तस्बिर (Full Size)</span>
                  </div>
                </div>

                {/* Direct Action Buttons Below Notice Image */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsZoomed(true);
                      setZoomLevel(1);
                    }}
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <Maximize2 className="w-4 h-4 text-red-400 shrink-0" />
                    <span>🔍 पूरा तस्बिर हेर्नुहोस् (Show Full Image)</span>
                  </button>

                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <Facebook className="w-4 h-4 fill-white shrink-0" />
                    <span>👉 फेसबुक पेजमा जोडिनुहोस्</span>
                  </a>
                </div>
              </div>
            )}

            {/* Notice Text Content (Shown below photo if provided) */}
            {message && (
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {message}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto px-5 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-200/70 transition-colors cursor-pointer order-2 sm:order-1 text-center"
            >
              बन्द गर्नुहोस् (Close)
            </button>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2 text-center"
            >
              <Facebook className="w-4 h-4 fill-white" />
              <span>Khabar GPT फेसबुक पेज खोल्नुहोस्</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Full Screen HD Image Lightbox Modal with Zoom & Direct Link */}
      {isZoomed && imageUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-2 sm:p-4 animate-in fade-in duration-150 select-none"
          onClick={() => setIsZoomed(false)}
        >
          {/* Top Control Bar */}
          <div
            className="w-full max-w-4xl flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 text-white rounded-2xl border border-slate-800 shadow-xl shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-bold text-xs sm:text-sm truncate">
                {title} (पूर्ण आकार)
              </span>
            </div>

            {/* Zoom & Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="जुम बढाउनुहोस् (Zoom In)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="जुम घटाउनुहोस् (Zoom Out)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="रिसेट गर्नुहोस् (Reset)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="मूल फाइल नयाँ ट्याबमा खोल्नुहोस्"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">नयाँ ट्याब</span>
              </a>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer ml-1"
                aria-label="बन्द गर्नुहोस्"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable / Zoomable Image Canvas */}
          <div
            className="flex-1 w-full max-w-4xl overflow-auto flex items-center justify-center p-2 my-2 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <img
              src={imageUrl}
              alt={title}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s ease-out'
              }}
              className="max-h-[82vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bottom Facebook Help Strip */}
          <div
            className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 text-white rounded-2xl border border-slate-800 text-xs shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-slate-300">
              💡 जुम गर्न बटनहरू प्रयोग गर्नुहोस् वा तस्बिरलाई नयाँ ट्याबमा खोल्नुहोस्।
            </span>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold hover:underline"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
              <span>Khabar GPT फेसबुक पेजमा जानुहोस्</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
