import React, { useState } from 'react';
import { SiteSettings } from '../types';
import {
  Search,
  Globe,
  Share2,
  Facebook,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
  ExternalLink,
  Save,
  Eye,
  ShieldCheck,
  Smartphone,
  Monitor,
  Sparkles,
  Link2,
  Layers,
  Code,
  BarChart3,
  CheckCircle
} from 'lucide-react';

interface AdminSeoPanelProps {
  settings: SiteSettings;
  onSave: (updatedSettings: Partial<SiteSettings>) => Promise<void>;
  isSaving: boolean;
}

export const AdminSeoPanel: React.FC<AdminSeoPanelProps> = ({
  settings,
  onSave,
  isSaving
}) => {
  // Local form state
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('mobile');
  const [activePreviewTab, setActivePreviewTab] = useState<'google' | 'facebook' | 'schema'>('google');
  const [showGuide, setShowGuide] = useState(false);

  // Sync if props update externally
  React.useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleChange = (key: keyof SiteSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  // Derived calculations for preview
  const title = formData.metaTitle || `${formData.siteTitle} – ${formData.siteSubtitle}`;
  const description = formData.metaDescription || formData.introTextNp;
  const ogTitle = formData.ogTitle || title;
  const ogDescription = formData.ogDescription || description;
  const ogImage = formData.ogImageUrl || formData.customLogoUrl || '/logo.svg';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://khabargpt.com';
  const displayUrl = formData.canonicalUrl || siteUrl;

  // SEO Score calculation
  const titleLen = title.length;
  const descLen = description.length;
  const hasKeywords = Boolean(formData.seoKeywords && formData.seoKeywords.trim());
  const hasFacebook = Boolean(formData.facebookUrl && formData.facebookUrl.includes('facebook.com'));
  const isIndexed = !formData.disallowSearchIndexing;
  const hasImage = Boolean(formData.ogImageUrl || formData.customLogoUrl);

  let score = 0;
  if (titleLen >= 30 && titleLen <= 70) score += 20; else if (titleLen > 0) score += 10;
  if (descLen >= 100 && descLen <= 170) score += 25; else if (descLen > 0) score += 15;
  if (hasKeywords) score += 15;
  if (hasFacebook) score += 15;
  if (isIndexed) score += 15;
  if (hasImage) score += 10;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Scorecard */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold mb-3">
              <Search className="w-3.5 h-3.5" />
              <span>SEO & Social Discoverability Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              सर्च इन्जिन तथा सामाजिक सञ्जाल व्यवस्थापन
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              गुगल (Google), फेसबुक (Facebook), र अन्य सर्च इन्जिनहरूमा खबर GPT लाई उच्च प्राथमिकतामा देखाउन 
              मेटा ट्याग, OpenGraph र Structured Data व्यवस्थापन गर्नुहोस्।
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-xl p-4 self-start md:self-auto">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border-2 border-indigo-500/40">
              <span className={`text-xl font-black ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                {score}
              </span>
              <span className="text-[10px] text-slate-400 absolute bottom-2">/100</span>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">SEO स्वास्थ्य स्कोर</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {score >= 80 ? 'अत्यन्त राम्रो (Optimized)' : score >= 60 ? 'सुधार आवश्यक (Good)' : 'अपूर्ण (Needs Action)'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {isIndexed ? '🟢 सर्च इन्जिन खुला छ' : '🔴 Noindex सक्रिय (बन्द)'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links / Shortcuts */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>लाइभ Sitemap.xml हेर्नुहोस्</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Robots.txt जाँच गर्नुहोस्</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <button
            type="button"
            onClick={() => handleCopy(`${siteUrl}/sitemap.xml`, 'sitemap_url')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <Copy className="w-3 h-3" />
            <span>{copiedKey === 'sitemap_url' ? 'प्रतिलिपि गरियो!' : 'Sitemap Link कपि'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 ml-auto transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>{showGuide ? 'मार्गदर्शन लुकाउनुहोस्' : 'सर्च नतिजा बढाउने तरिकाहरू हेर्नुहोस्'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible SEO & Ranking Strategy Guide */}
      {showGuide && (
        <div className="bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-indigo-200 rounded-2xl p-6 shadow-sm animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>सर्च इन्जिन (Google) र फेसबुकमा खबर GPT को पहुँच बढाउने ५ सुनौला नियमहरू</span>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded"
            >
              बन्द गर्नुहोस् ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs text-slate-700">
            <div className="p-3.5 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">१</span>
                <span>Google Search Console मा साइट दर्ता:</span>
              </div>
              <p className="leading-relaxed">
                तलको <strong>"Google Site Verification"</strong> बक्समा गुगल कोड राखेपछि <code>https://search.google.com/search-console</code> मा गएर आफ्नो वेबसाइट र <code>/sitemap.xml</code> पेश गर्नुहोस्। यसले गुगललाई २४-४८ घण्टाभित्र साइट क्रल गर्न लगाउँछ।
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">२</span>
                <span>फेसबुक पेज र वेबसाइटको आपसी अन्तरसम्बन्ध:</span>
              </div>
              <p className="leading-relaxed">
                आफ्नो आधिकारिक फेसबुक पेजको <strong>"About"</strong> र <strong>"Website"</strong> सेक्सनमा खबर GPT को यो डोमेन लिङ्क अनिवार्य राख्नुहोस्। साथै यस प्यानलमा आफ्नो फेसबुक URL राख्दा Google को Schema.org ले दुवैलाई एउटै ब्रान्ड संस्थाको रूपमा प्रमाणित गर्छ।
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">३</span>
                <span>सर्च किवर्ड र शीर्षकको ढाँचा (Keywords):</span>
              </div>
              <p className="leading-relaxed">
                नेपाली र अङ्ग्रेजी दुवै किवर्ड समावेश गर्नुहोस्: <em>"Khabar GPT", "खबर GPT", "Nepal current affairs", "नेपाल समसामयिक", "Facebook Khabar GPT"</em>। गुगलमा मानिसहरूले दुवै भाषामा खोज्ने हुनाले दुवै लिपि आवश्यक हुन्छ।
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">४</span>
                <span>आकर्षक OpenGraph तस्बिर (Social Card):</span>
              </div>
              <p className="leading-relaxed">
                फेसबुक वा मेसेन्जरमा लिङ्क सेयर गर्दा ठूलो ब्यानर तस्बिर (1200x630 पिक्सेल) देखिनुपर्छ। यसले प्रयोगकर्ताको ध्यान तान्छ र क्लिक दर (CTR) ४ गुणा बढाउँछ।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live SERP & Social Card Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm">प्रत्यक्ष पूर्वावलोकन (Live Search & Social Preview)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setActivePreviewTab('google')}
                className={`px-3 py-1 rounded-md transition ${activePreviewTab === 'google' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Google Search
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('facebook')}
                className={`px-3 py-1 rounded-md transition ${activePreviewTab === 'facebook' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Facebook / Social
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('schema')}
                className={`px-3 py-1 rounded-md transition ${activePreviewTab === 'schema' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Schema.org (JSON-LD)
              </button>
            </div>

            {activePreviewTab === 'google' && (
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md ${previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md ${previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-100/50">
          {/* Google Preview */}
          {activePreviewTab === 'google' && (
            <div className={`mx-auto bg-white rounded-xl p-5 shadow-sm border border-slate-200 ${previewDevice === 'mobile' ? 'max-w-md' : 'max-w-2xl'}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                  <img src={formData.customLogoUrl || '/logo.svg'} alt="Logo" className="w-4 h-4 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium text-slate-800 leading-tight">
                    {formData.siteTitle || 'Khabar GPT'}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate max-w-[280px]">
                    {displayUrl}
                  </span>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-blue-800 hover:underline cursor-pointer leading-snug line-clamp-2">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">
                {description}
              </p>
              {isIndexed ? (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>गुगलमा सूचिकरण अनुमति प्राप्त छ (Indexable)</span>
                </div>
              ) : (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-red-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>चेतावनी: Noindex सक्रिय छ, गुगलले यो पृष्ठ खोज परिणाममा देखाउने छैन!</span>
                </div>
              )}
            </div>
          )}

          {/* Facebook Social Share Preview */}
          {activePreviewTab === 'facebook' && (
            <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600 fill-current" />
                  <span className="font-semibold text-slate-800">Facebook News Feed & Messenger Preview</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">OpenGraph Card</span>
              </div>
              <div className="w-full h-44 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                {ogImage ? (
                  <img
                    src={ogImage}
                    alt="Social Card Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                    <Globe className="w-8 h-8" />
                    <span>No OpenGraph Image</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                  1200 x 630
                </div>
              </div>
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold truncate block">
                  {new URL(displayUrl || 'https://khabargpt.com').hostname}
                </span>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {ogTitle}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {ogDescription}
                </p>
              </div>
            </div>
          )}

          {/* Schema.org Inspector */}
          {activePreviewTab === 'schema' && (
            <div className="max-w-2xl mx-auto bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs overflow-x-auto relative">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                  <Code className="w-4 h-4" />
                  <span>Google Knowledge Graph JSON-LD Schema</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(
                        {
                          '@context': 'https://schema.org',
                          '@type': 'NewsMediaOrganization',
                          name: formData.siteTitle,
                          alternateName: 'खबर GPT',
                          url: displayUrl,
                          sameAs: [
                            formData.facebookUrl,
                            formData.youtubeUrl,
                            formData.tiktokUrl,
                            formData.instagramUrl,
                            formData.twitterUrl
                          ].filter(Boolean)
                        },
                        null,
                        2
                      ),
                      'schema_copy'
                    )
                  }
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey === 'schema_copy' ? 'Copied!' : 'Copy Schema'}</span>
                </button>
              </div>
              <pre className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "name": "${formData.siteTitle}",
  "alternateName": "खबर GPT",
  "url": "${displayUrl}",
  "logo": "${ogImage}",
  "description": "${description.slice(0, 80)}...",
  "sameAs": [
    "${formData.facebookUrl || 'https://facebook.com/khabargpt'}"${formData.youtubeUrl ? `,\n    "${formData.youtubeUrl}"` : ''}${formData.tiktokUrl ? `,\n    "${formData.tiktokUrl}"` : ''}
  ],
  "publishingPrinciples": "${displayUrl}/editorial-standards",
  "correctionsPolicy": "${displayUrl}/corrections"
}`}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Core Search Meta Tags */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">१. साइट-व्यापी सर्च मेटा ट्यागहरू (Meta Tags)</h3>
              <p className="text-xs text-slate-500">
                गुगल र बिंगजस्ता सर्च इन्जिनहरूले खोज परिणाममा देखाउने शीर्षक, विवरण र किवर्डहरू
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Meta Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  सर्च इन्जिन शीर्षक (Meta Title / &lt;title&gt;) <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs font-mono font-medium ${titleLen < 30 || titleLen > 65 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {titleLen} / ६० अक्षर (सिफारिस: ३०-६०)
                </span>
              </div>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                placeholder="Khabar GPT (खबर GPT) – Nepal Current Affairs, Explainers & Information Hub"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                यो शीर्षक गुगल सर्चमा नीलो लिङ्कको रूपमा देखिन्छ। यसमा 'Khabar GPT' र 'नेपाल' शब्द अनिवार्य राख्नुहोस्।
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  मेटा विवरण (Meta Description) <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs font-mono font-medium ${descLen < 110 || descLen > 165 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {descLen} / १६० अक्षर (सिफारिस: १२०-१६०)
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.metaDescription || ''}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                placeholder="नेपालका समसामयिक विषय, तथ्यपरक विश्लेषण, भिडियो एक्सप्लेनर र सामाजिक सरोकारका जानकारी। जिम्मेवार र स्वतन्त्र डिजिटल सूचना पृष्ठ।"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                सर्च परिणाममा देखिने २ वाक्यको संक्षिप्त सारांश। यसले प्रयोगकर्तालाई वेबसाइट खोल्न प्रेरित गर्छ।
              </p>
            </div>

            {/* SEO Keywords */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                सर्च किवर्डहरू (Keywords - अल्पविरामले छुट्ट्याउनुहोस्)
              </label>
              <input
                type="text"
                value={formData.seoKeywords || ''}
                onChange={(e) => handleChange('seoKeywords', e.target.value)}
                placeholder="Khabar GPT, खबर GPT, Nepal current affairs, Nepal news, Facebook Khabar GPT, तथ्यपरक विश्लेषण, नेपाल"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium transition"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.seoKeywords?.split(',').map((kw, i) => kw.trim() && (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                    #{kw.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Canonical URL & Indexing Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                  आधिकारिक डोमेन (Canonical URL)
                </label>
                <input
                  type="url"
                  value={formData.canonicalUrl || ''}
                  onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                  placeholder="https://khabargpt.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  खाली छाडेमा वर्तमान डोमेन स्वतः प्रयोग हुनेछ।
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                  सर्च इन्जिन अनुक्रमणिका स्थिति (Robots Indexing)
                </label>
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                  <input
                    type="checkbox"
                    id="seo-indexing"
                    checked={!formData.disallowSearchIndexing}
                    onChange={(e) => handleChange('disallowSearchIndexing', !e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="seo-indexing" className="text-xs font-medium text-slate-800 cursor-pointer">
                    गुगल र अन्य सर्च इन्जिनहरूलाई सूचिकरण गर्न दिनुहोस् (Index & Follow)
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {formData.disallowSearchIndexing ? '❌ सर्च इन्जिनहरूले यो वेबसाइट खोजमा देखाउने छैनन्।' : '✅ गुगल र बिंगले साइट सूचिकरण गर्नेछन्।'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: OpenGraph & Facebook Sharing Optimization */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">२. फेसबुक तथा सामाजिक सञ्जाल सेयरिङ (OpenGraph & Twitter Cards)</h3>
              <p className="text-xs text-slate-500">
                फेसबुक, मेसेन्जर, ह्वाट्सएप वा ट्विटरमा लिङ्क पठाउँदा देखिने तस्बिर र शीर्षक
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Facebook Page Display Name */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                  फेसबुक पेजको नाम (og:site_name)
                </label>
                <input
                  type="text"
                  value={formData.facebookPageName || ''}
                  onChange={(e) => handleChange('facebookPageName', e.target.value)}
                  placeholder="Khabar GPT"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition"
                />
              </div>

              {/* Twitter Card Type */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                  ट्विटर/X कार्ड प्रकार (twitter:card)
                </label>
                <select
                  value={formData.twitterCard || 'summary_large_image'}
                  onChange={(e) => handleChange('twitterCard', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition"
                >
                  <option value="summary_large_image">ठूलो ब्यानर कार्ड (summary_large_image - सिफारिस)</option>
                  <option value="summary">सानो थम्बनेल कार्ड (summary)</option>
                </select>
              </div>
            </div>

            {/* OG Title */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                फेसबुक सेयर शीर्षक (og:title)
              </label>
              <input
                type="text"
                value={formData.ogTitle || ''}
                onChange={(e) => handleChange('ogTitle', e.target.value)}
                placeholder="Khabar GPT (खबर GPT) – Nepal Current Affairs & Social Media Hub"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition"
              />
            </div>

            {/* OG Description */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                फेसबुक सेयर विवरण (og:description)
              </label>
              <textarea
                rows={2}
                value={formData.ogDescription || ''}
                onChange={(e) => handleChange('ogDescription', e.target.value)}
                placeholder="नेपालका समसामयिक विषय, तथ्यपरक विश्लेषण, भिडियो एक्सप्लेनर र सामाजिक सरोकारका जानकारी। आधिकारिक फेसबुक र सामाजिक सञ्जालमा जोडिनुहोस्।"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition"
              />
            </div>

            {/* OG Image URL */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                सामाजिक सञ्जाल ब्यानर तस्बिर URL (og:image - 1200x630 सिफारिस)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.ogImageUrl || ''}
                  onChange={(e) => handleChange('ogImageUrl', e.target.value)}
                  placeholder="/logo.svg वा https://.../banner.jpg"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm font-medium transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleChange('ogImageUrl', formData.customLogoUrl || '/logo.svg')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  लोगो राख्नुहोस्
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                फेसबुक डिबगर (Facebook Sharing Debugger) मा यो तस्बिर परीक्षण गर्न सकिन्छ।
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Google Search Console Verification */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">३. गुगल सर्च कन्सोल प्रमाणीकरण (Google Search Console Verification)</h3>
              <p className="text-xs text-slate-500">
                गुगललाई वेबसाइटको आधिकारिक स्वामित्व प्रमाणित गर्ने कोड
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Active HTML File Verification Banner */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-sm">गुगल प्रमाणीकरण फाइल सक्रिय (Google Verification File Ready)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                  ✓ लाइभ सक्रिय
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                तपाईंको आधिकारिक प्रमाणीकरण फाइल <code>/google0087e514b59ec8b5.html</code> वेबसाइटमा पूर्ण रूपमा सक्रिय भइसकेको छ। Google Search Console मा <strong>"HTML file"</strong> विधि छान्नुहोस् र सिधै <strong>"Verify"</strong> बटन थिच्नुहोस्!
              </p>
              <div className="pt-1 flex items-center gap-2 flex-wrap">
                <a
                  href="/google0087e514b59ec8b5.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 transition text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>फाइल परीक्षण गर्नुहोस् (/google0087e514b59ec8b5.html)</span>
                </a>
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-[11px]"
                >
                  <Search className="w-3 h-3" />
                  <span>Google Search Console खोल्नुहोस्</span>
                </a>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                वैकल्पिक: Google Site Verification कोड (HTML Tag Token)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.googleSiteVerification || ''}
                  onChange={(e) => handleChange('googleSiteVerification', e.target.value)}
                  placeholder="google0087e514b59ec8b5"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-mono transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                यदि "HTML tag" विधि प्रयोग गर्ने हो भने पनि <code>google0087e514b59ec8b5</code> कोड यहाँ सुरक्षित गरिएको छ।
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>गुगल सर्च कन्सोल प्रमाणीकरण गर्ने सजिला ४ चरणहरू:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
                <li><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium">Google Search Console</a> खोल्नुहोस् र आफ्नो Gmail बाट लगइन गर्नुहोस्।</li>
                <li>आफ्नो वेबसाइटको URL (उदा: https://khabargpt.onrender.com) "URL prefix" मा राख्नुहोस्।</li>
                <li>प्रमाणीकरण विधिहरू मध्ये <strong>"HTML file"</strong> वा <strong>"HTML tag"</strong> रोज्नुहोस्।</li>
                <li>गुगल कन्सोलमा सिधै <strong>"Verify"</strong> थिच्नुहोस्। स्वामित्व तुरुन्त प्रमाणित हुनेछ!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Section 4: Web Analytics & Visitor Tracking */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">४. भिजिटर एनालिटिक्स & ट्र्याकिङ (Web Analytics)</h3>
              <p className="text-xs text-slate-500">
                गुगल एनालिटिक्स र फेसबुक पिक्सेल कोडमार्फत दैनिक पाठक र भिजिटरको संख्या नाप्नुहोस्
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                Google Analytics Measurement ID (GA4)
              </label>
              <input
                type="text"
                value={formData.googleAnalyticsId || ''}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                placeholder="उदा: G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500 text-sm font-mono transition"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Google Analytics 4 बाट प्राप्त हुने 'G-' कोड यहाँ राख्नुहोस्।
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
                Meta (Facebook) Pixel ID
              </label>
              <input
                type="text"
                value={formData.metaPixelId || ''}
                onChange={(e) => handleChange('metaPixelId', e.target.value)}
                placeholder="उदा: 123456789012345"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500 text-sm font-mono transition"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                फेसबुक विज्ञापन तथा पेज अडियन्स ट्र्याक गर्न पिक्सेल आइडी।
              </p>
            </div>
          </div>
        </div>

        {/* Submit / Save Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-4 shadow-xl flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>परिवर्तनहरू सुरक्षित गरेपछि तत्काल सबै पृष्ठहरूमा लागू हुनेछ।</span>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>सुरक्षित हुँदैछ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SEO सेटिङहरू सुरक्षित गर्नुहोस्</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
