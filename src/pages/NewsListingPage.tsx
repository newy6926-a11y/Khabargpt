import React, { useState } from 'react';
import { ContentItem, Category } from '../types';
import { Search, ChevronRight, Clock, Eye, Filter, Facebook, ExternalLink } from 'lucide-react';

interface NewsListingPageProps {
  content: ContentItem[];
  categories: Category[];
  initialCategory?: string;
  onSelectArticle: (slugOrId: string) => void;
}

export const NewsListingPage: React.FC<NewsListingPageProps> = ({
  content,
  categories,
  initialCategory = 'all',
  onSelectArticle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const published = content.filter((c) => c.status === 'published');

  const filtered = published.filter((item) => {
    const matchCat =
      selectedCategory === 'all' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchType = selectedType === 'all' || item.type === selectedType;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q);
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
          समाचार, जानकारी तथा एक्सप्लेनर सङ्ग्रह
        </h1>
        <p className="text-sm text-slate-600">
          नेपालका समसामयिक सार्वजनिक चासोका विषयहरू, नीतिगत परिवर्तन र तथ्यपरक जानकारीहरूको अभिलेख।
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="शीर्षक वा विषयवस्तु खोज्नुहोस्..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
            >
              <option value="all">सबै प्रकार (All Types)</option>
              <option value="article">समाचार / अपडेट (Articles)</option>
              <option value="explainer">एक्सप्लेनर (Explainers)</option>
              <option value="video">भिडियो (Videos)</option>
              <option value="notice">महत्त्वपूर्ण सूचना (Notices)</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="md:col-span-3 flex justify-end">
            {(selectedCategory !== 'all' || selectedType !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSearchQuery('');
                }}
                className="text-xs text-red-600 hover:underline font-medium cursor-pointer"
              >
                सबै फिल्टर रिसेट गर्नुहोस्
              </button>
            )}
          </div>
        </div>

        {/* Categories scrollable pill list */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            सबै श्रेणीहरू
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.name
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-500">
        कुल फेला परेका सामग्री: <span className="font-bold text-slate-900 font-mono tabular-nums">{filtered.length}</span>
      </div>

      {/* Items list */}
      {filtered.length === 0 ? (
        <div className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 border-2 border-blue-100 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Facebook className="w-7 h-7 fill-white" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900">
              समाचार तथा भिडियो सामग्री आधिकारिक फेसबुक पेजमा उपलब्ध छन्
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              खबर GPT ले हाल वेबसाइटमा समाचार प्रकाशन सुरु गरेको छैन। हाम्रा सम्पूर्ण नयाँ समाचार, भिडियो रिपोर्ट र प्रत्यक्ष अपडेटहरू केवल हाम्रो आधिकारिक Facebook Page मार्फत प्रवाह भइरहेका छन्।
            </p>
          </div>
          <div className="pt-2">
            <a
              href="https://facebook.com/khabargpt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Facebook className="w-4 h-4 fill-white" />
              <span>👉 खबर GPT आधिकारिक फेसबुक पेजमा जोडिनुहोस्</span>
              <ExternalLink className="w-4 h-4 text-blue-200" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectArticle(item.slug)}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-red-300 hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-red-600">{item.category}</span>
                  <span>·</span>
                  <span className="capitalize">{item.type}</span>
                  <span>·</span>
                  <span>{new Date(item.createdAt).toLocaleDateString('ne-NP')}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 hover:text-red-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{item.summary}</p>
              </div>

              <div className="shrink-0 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{item.views}</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold group-hover:bg-red-50 group-hover:text-red-600 flex items-center gap-1">
                  <span>विस्तृत</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
