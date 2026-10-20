import React, { useEffect, useRef, useState } from 'react';
import { AdItem } from '../types';
import { api } from '../services/api';
import { ExternalLink, PlayCircle, ShieldCheck, X } from 'lucide-react';

interface AdBannerProps {
  ad?: AdItem | null;
  position?: 'header' | 'header_top' | 'sidebar' | 'in_article' | 'footer' | 'popup_banner';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ ad, position, className = '' }) => {
  const impressionRecorded = useRef(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (ad && !impressionRecorded.current) {
      impressionRecorded.current = true;
      api.recordAdImpression(ad.id);
    }
  }, [ad]);

  if (!ad || !ad.active || closed) return null;

  const handleClick = (e: React.MouseEvent) => {
    // Prevent double fire if clicked on an anchor
    api.recordAdClick(ad.id);
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const bannerImage = ad.imageUrl || ad.mediaUrl;
  const videoSource = ad.videoEmbedUrl || ad.videoUrl || ad.mediaUrl;
  const sponsor = ad.sponsorName || ad.clientName || 'प्रायोजक';
  const isVideoEmbed = Boolean(
    videoSource &&
      (videoSource.includes('youtube.com') ||
        videoSource.includes('youtu.be') ||
        videoSource.includes('vimeo.com'))
  );

  // Convert youtube standard watch URL to embed URL if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const vidId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${vidId}`;
    }
    if (url.includes('youtu.be/')) {
      const vidId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${vidId}`;
    }
    return url;
  };

  return (
    <div
      className={`border border-slate-200/90 bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs relative overflow-hidden my-4 group transition-all hover:shadow-xs ${className}`}
    >
      {/* Transparency Sponsored Badge */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
        <span className="inline-flex items-center gap-1 font-bold text-slate-700 uppercase tracking-wider bg-slate-200/90 px-2 py-0.5 rounded text-[10px]">
          {ad.disclaimerNotice || 'प्रायोजित सामग्री (Sponsored Ad)'}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-medium">प्रायोजक: {sponsor}</span>
          {position === 'popup_banner' && (
            <button
              onClick={() => setClosed(true)}
              className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded"
              title="बन्द गर्नुहोस्"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Ad Content based on type */}
      {ad.type === 'video' ? (
        <div className="space-y-2.5">
          {isVideoEmbed ? (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
              <iframe
                src={getEmbedUrl(videoSource!)}
                title={ad.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : videoSource ? (
            <video
              src={videoSource}
              controls
              className="w-full rounded-xl aspect-video object-cover bg-black border border-slate-200"
            />
          ) : null}

          <div className="flex items-center justify-between pt-1">
            <div>
              <h4 className="font-bold text-sm text-slate-900 leading-snug">{ad.title}</h4>
              {ad.description && <p className="text-xs text-slate-600 mt-0.5">{ad.description}</p>}
            </div>
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              <span>विस्तृत हेर्नुहोस्</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (ad.type === 'photo' || ad.type === 'banner') && bannerImage ? (
        <div
          onClick={handleClick}
          className="cursor-pointer block relative rounded-xl overflow-hidden transition-all hover:opacity-95 group"
        >
          <img
            src={bannerImage}
            alt={ad.title}
            className="w-full h-auto max-h-56 object-cover rounded-xl"
            loading="lazy"
          />
          <div className="mt-2 flex items-center justify-between">
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-red-600 transition-colors line-clamp-1">
              {ad.title}
            </h4>
            <span className="inline-flex items-center gap-1 text-xs text-red-600 font-bold shrink-0 ml-2">
              <span>थप जानकारी</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      ) : (
        /* Sponsored Link Card */
        <div
          onClick={handleClick}
          className="cursor-pointer p-4 bg-white border border-slate-200 rounded-xl hover:border-red-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
        >
          <div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors">
              {ad.title}
            </h4>
            {ad.description && <p className="text-xs text-slate-600 mt-1">{ad.description}</p>}
          </div>
          <button className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors">
            <span>थप जान्नुहोस्</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
