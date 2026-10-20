import React, { useState } from 'react';
import { ContentItem } from '../types';
import { PlayCircle, ExternalLink, Facebook, Eye, Search, Share2, Sparkles } from 'lucide-react';

interface VideosPageProps {
  content: ContentItem[];
  facebookUrl?: string;
  onSelectArticle: (slugOrId: string) => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({
  content,
  facebookUrl = 'https://facebook.com/khabargpt',
  onSelectArticle
}) => {
  const [search, setSearch] = useState('');

  const videos = content.filter((i) => i.status === 'published' && i.type === 'video');

  const filtered = videos.filter((v) => {
    const q = search.toLowerCase();
    return !search || v.title.toLowerCase().includes(q) || v.summary.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header with Official FB Link */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-red-400 font-bold uppercase tracking-wider">
            <Facebook className="w-4 h-4 fill-blue-500 text-blue-500" />
            <span>Khabar GPT आधिकारिक भिडियो & Reels</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-sans">
            भिडियो र दृश्य विश्लेषण शृङ्खला
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            नेपालका समसामयिक सार्वजनिक चासोका विषयहरूलाई छोटो, प्रभावकारी र तथ्यमा आधारित भिडियो मार्फत प्रस्तुत गरिएको सङ्ग्रह।
          </p>
        </div>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 shrink-0"
        >
          <Facebook className="w-4 h-4" />
          <span>फेसबुकमा फलो गर्नुहोस्</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Search */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="भिडियो शीर्षक खोज्नुहोस्..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Videos Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-500 text-sm space-y-2">
          <PlayCircle className="w-8 h-8 mx-auto text-slate-400" />
          <p className="font-semibold text-slate-700">कुनै भिडियो सामग्री फेला परेन</p>
          <p className="text-xs">व्यवस्थापक ड्यासबोर्डबाट नयाँ फेसबुक भिडियो वा Reel लिङ्क थप्न सकिन्छ।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vid) => (
            <div
              key={vid.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Media Thumbnail Container */}
              <div
                onClick={() => onSelectArticle(vid.slug)}
                className="bg-slate-900 aspect-video relative cursor-pointer overflow-hidden group flex items-center justify-center text-white"
              >
                {vid.featuredImage ? (
                  <img
                    src={vid.featuredImage}
                    alt={vid.imageAlt || vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-4 text-center">
                    <PlayCircle className="w-12 h-12 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-slate-300">खबर GPT भिडियो</span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  Facebook Post
                </div>
              </div>

              {/* Content Info */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-red-600">{vid.category}</span>
                  <span className="flex items-center gap-1 font-mono tabular-nums">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{vid.views}</span>
                  </span>
                </div>

                <h3
                  onClick={() => onSelectArticle(vid.slug)}
                  className="text-base font-bold text-slate-900 hover:text-red-600 cursor-pointer transition-colors line-clamp-2"
                >
                  {vid.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {vid.summary}
                </p>
              </div>

              {/* Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectArticle(vid.slug)}
                  className="text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
                >
                  विवरण हेर्नुहोस्
                </button>

                {vid.facebookPostUrl && (
                  <a
                    href={vid.facebookPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <span>फेसबुकमा खोल्नुहोस्</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
