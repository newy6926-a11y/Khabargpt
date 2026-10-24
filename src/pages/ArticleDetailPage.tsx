import React, { useState, useEffect } from 'react';
import { ContentItem, SiteSettings, AdItem } from '../types';
import { offlineStorage } from '../utils/offlineStorage';
import { ArticleReactionsAndFeedback } from '../components/ArticleReactionsAndFeedback';
import { BrandedQuoteGeneratorModal } from '../components/BrandedQuoteGeneratorModal';
import { AdBanner } from '../components/AdBanner';
import { api } from '../services/api';
import { ReadingProgressBar } from '../components/ReadingProgressBar';
import { AccessibilityToolbar } from '../components/AccessibilityToolbar';
import { CommunityBroadcastModal } from '../components/CommunityBroadcastModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  ExternalLink,
  Share2,
  AlertCircle,
  Copy,
  Check,
  Facebook,
  MessageCircle,
  ShieldCheck,
  Bookmark,
  Sparkles,
  AlertTriangle,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';

interface ArticleDetailPageProps {
  item: ContentItem;
  relatedItems: ContentItem[];
  settings?: SiteSettings;
  onBack: () => void;
  onSelectArticle: (slugOrId: string) => void;
  onNavigate: (path: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  item,
  relatedItems,
  settings,
  onBack,
  onSelectArticle,
  onNavigate
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [articleAds, setArticleAds] = useState<AdItem[]>([]);

  useEffect(() => {
    setIsSavedOffline(offlineStorage.isSaved(item.id));
    // Fetch in-article ads
    api.getAds('in_article').then((ads) => setArticleAds(ads)).catch(() => {});
  }, [item.id]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    const text = `${item.title}\n${currentUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleSaveOffline = () => {
    if (isSavedOffline) {
      offlineStorage.removeArticle(item.id);
      setIsSavedOffline(false);
    } else {
      offlineStorage.saveArticle(item);
      setIsSavedOffline(true);
    }
  };

  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20 relative">
      {/* 1. Sleek Reading Progress Bar */}
      <ReadingProgressBar estimatedTotalMinutes={Math.max(2, Math.round(item.body.length / 500))} />

      {/* Back button & Action Row */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>पछाडि फर्कनुहोस् (Back)</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Offline Save Button */}
          <button
            onClick={toggleSaveOffline}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isSavedOffline
                ? 'bg-red-50 border-red-300 text-red-700 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="इन्टरनेट नभएको बेला पढ्नका लागि सेभ गर्नुहोस्"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSavedOffline ? 'fill-red-600 text-red-600' : 'text-slate-500'}`} />
            <span>{isSavedOffline ? 'अफलाइन सुरक्षित' : 'अफलाइन सेभ'}</span>
          </button>

          {/* Social Quote Card Generator */}
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>कोट कार्ड बनाउनुहोस्</span>
          </button>
        </div>
      </div>

      {/* Header & Metadata */}
      <header className="space-y-4 border-b border-slate-200 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-red-600 uppercase tracking-wider">{item.category}</span>
          <span aria-hidden="true">·</span>
          <span>
            {item.type === 'explainer'
              ? 'एक्सप्लेनर (Explainer)'
              : item.type === 'video'
              ? 'भिडियो'
              : 'जानकारी'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(item.createdAt).toLocaleDateString('ne-NP')}</span>
          </span>
          {item.updatedAt && item.updatedAt !== item.createdAt && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                अद्यावधिक: {new Date(item.updatedAt).toLocaleDateString('ne-NP')}
              </span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans text-slate-900 leading-snug">
          {item.title}
        </h1>

        {item.titleEn && (
          <p className="text-sm font-medium text-slate-500 italic">
            {item.titleEn}
          </p>
        )}

        <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          {item.summary}
        </p>

        {/* Byline & Fact Check Attribution */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>प्रकाशन: <strong className="text-slate-800">{item.author}</strong></span>
            {item.factCheckStatus && (
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                item.factCheckStatus === 'official_record'
                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                  : item.factCheckStatus === 'confirmed'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  : item.factCheckStatus === 'alleged'
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}>
                {item.factCheckStatus === 'official_record'
                  ? '✓ आधिकारिक अभिलेख'
                  : item.factCheckStatus === 'confirmed'
                  ? '✓ प्रमाणित तथ्य'
                  : item.factCheckStatus === 'alleged'
                  ? '⚠ दाबी / अनुसन्धानरत'
                  : 'परामर्शित'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.views} पटक हेरिएको</span>
            </span>
          </div>
        </div>

        {/* Font Adjuster & Quick Share */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <span className="text-[11px] text-slate-500 font-medium px-1.5">अक्षर:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                fontSize === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded text-sm font-bold transition-colors cursor-pointer ${
                fontSize === 'large' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded text-base font-bold transition-colors cursor-pointer ${
                fontSize === 'xlarge' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A++
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Reader Button */}
            <button
              onClick={() => setAccessibilityModalOpen(true)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-bold text-xs"
              title="यो लेख नेपाली आवाजमा सुन्नुहोस्"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>वाचक (सुन्नुहोस्)</span>
            </button>
            <button
              onClick={handleFacebookShare}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold text-xs"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span>फेसबुक</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>ह्वाट्सएप</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-medium text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'कपि भयो' : 'लिङ्क'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sensitive Subject Legal & Public Domain Disclaimers */}
      {item.disclaimerType && item.disclaimerType !== 'none' && (
        <div className="bg-amber-50/90 border-l-4 border-amber-500 rounded-r-xl p-4 text-xs text-amber-950 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {item.disclaimerType === 'financial' && 'वित्तीय तथा बजार दर सचेतना डिस्क्लेमर'}
              {item.disclaimerType === 'health' && 'स्वास्थ्य तथा चिकित्सा परामर्श सम्बन्धी डिस्क्लेमर'}
              {item.disclaimerType === 'legal' && 'अदालती प्रक्रिया तथा कानुनी स्थिति सम्बन्धी डिस्क्लेमर'}
              {item.disclaimerType === 'factcheck' && 'विकासोन्मुख घटना तथा तथ्य प्रमाणीकरण डिस्क्लेमर'}
              {item.disclaimerType === 'satire' && 'व्यङ्ग्य तथा व्यक्तिगत विचार स्तम्भ'}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900">
            {item.customDisclaimer ||
              (item.disclaimerType === 'financial'
                ? 'बजार मूल्य, सेयर बजार, सुनचाँदी तथा विनिमय दरहरू प्रतिपल परिवर्तनशील हुन सक्छन्। प्रस्तुत तथ्यांक खुला सार्वजनिक स्रोतबाट संकलित सूचनामूलक जानकारी मात्र हो। कुनै पनि आर्थिक निर्णय लिनुपूर्व आधिकारिक निकायसँग पुष्टि गर्नुहोस्।'
                : item.disclaimerType === 'health'
                ? 'प्रस्तुत सामग्री सामान्य स्वास्थ्य सचेतनाका लागि मात्र हो। यो कुनै पनि रोगको निदान वा चिकित्सकको प्रत्यक्ष सल्लाहको विकल्प होइन।'
                : item.disclaimerType === 'legal'
                ? 'अदालतमा विचाराधीन वा आरोप लागेका विषयमा सक्षम अदालतबाट अन्तिम फैसला नआएसम्म कसैलाई दोषी मान्न मिल्दैन।'
                : 'घटनाको विकासक्रमसँगै प्रारम्भिक सूचनाहरू परिवर्तन हुन सक्छन्। हामी तथ्य पुष्टि भएबमोजिम परिमार्जन गर्दै जानेछौँ।')}
          </p>
        </div>
      )}

      {/* Featured Visual */}
      {item.featuredImage && (
        <figure className="space-y-1.5">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-[460px] relative">
            <img
              src={item.featuredImage}
              alt={item.imageAlt || item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {item.isIllustrativeVisual && (
              <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium">
                प्रतिकात्मक तस्बिर (Illustrative Visual)
              </span>
            )}
          </div>
          {(item.imageAttribution || item.imageAlt) && (
            <figcaption className="text-[11px] text-slate-500 italic px-1 flex justify-between">
              <span>{item.imageAlt}</span>
              {item.imageAttribution && <span>तस्बिर सौजन्य: {item.imageAttribution}</span>}
            </figcaption>
          )}
        </figure>
      )}

      {/* Article Body Content */}
      <article
        className={`prose prose-slate max-w-none text-slate-800 space-y-4 ${
          fontSize === 'xlarge'
            ? 'text-xl leading-loose'
            : fontSize === 'large'
            ? 'text-lg leading-relaxed'
            : 'text-base leading-relaxed'
        }`}
      >
        {item.body.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </article>

      {/* Official Khabar GPT Facebook Page Redirect Callout */}
      <div className="my-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-5 sm:p-6 rounded-2xl shadow-lg border border-blue-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <Facebook className="w-3.5 h-3.5 fill-current" />
            <span>Khabar GPT आधिकारिक फेसबुक पेज</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white">
            ताजा समाचार, भिडियो र प्रत्यक्ष अपडेटका लागि हाम्रो फेसबुक पेजमा जोडिनुहोस्
          </h4>
          <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
            खबर GPT हाल मुख्य रूपमा फेसबुक पेज मार्फत सञ्चालन भइरहेको छ। सम्पूर्ण ताजा सूचना, तथ्यपरक विश्लेषण र भिडियो सामग्री हाम्रो आधिकारिक फेसबुक पेजमा नियमित प्रकाशन हुन्छन्।
          </p>
        </div>

        <a
          href={settings?.facebookUrl || 'https://facebook.com/khabargpt'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Facebook className="w-4 h-4 fill-blue-600 text-blue-600" />
          <span>फेसबुक पेजमा जानुहोस्</span>
          <ExternalLink className="w-4 h-4 text-blue-600" />
        </a>
      </div>

      {/* In-Article Sponsored Banner (if configured in Admin) */}
      {articleAds.length > 0 && <AdBanner ad={articleAds[0]} position="in_article" />}

      {/* Source Reference */}
      {(item.sourceUrl || item.sourceName) && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
          <h4 className="font-bold text-slate-900">स्रोत तथा सन्दर्भ (Source Reference):</h4>
          <div className="flex flex-wrap items-center gap-2">
            <span>{item.sourceName || 'सार्वजनिक स्रोत'}</span>
            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1 font-medium"
              >
                <span>आधिकारिक स्रोत पृष्ठ</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Reader Reactions & Feedback System */}
      <ArticleReactionsAndFeedback item={item} />

      {/* Related Content */}
      {relatedItems.length > 0 && (
        <section className="pt-4 border-t border-slate-200 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">सम्बन्धित सामग्रीहरू</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedItems.slice(0, 3).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectArticle(rel.slug)}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-red-300 hover:shadow-xs transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-semibold text-red-600">{rel.category}</span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1">{rel.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{rel.summary}</p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(rel.createdAt).toLocaleDateString('ne-NP')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Community WhatsApp & Viber Broadcast Channels Callout */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-5 rounded-2xl border border-emerald-800/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <MessageCircle className="w-4 h-4" />
            <span>Khabar GPT आधिकारिक समुदाय</span>
          </div>
          <h4 className="font-bold text-base text-white">
            दैनिक मुख्य ३ खबर मात्र सिधै आफ्नो WhatsApp वा Viber मा पाउनुहोस्
          </h4>
          <p className="text-xs text-slate-300">
            कुनै विज्ञापन वा अनावश्यक सन्देश आउँदैन। तपाईंको नम्बर पूर्ण रूपमा सुरक्षित र गोप्य रहनेछ।
          </p>
        </div>

        <button
          onClick={() => setCommunityModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>च्यानलमा जोडिनुहोस्</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Branded Social Quote Generator Modal */}
      <BrandedQuoteGeneratorModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        settings={settings}
        initialQuote={item.summary || item.title}
        initialSpeaker={item.author}
        initialTitle={item.category}
      />

      {/* Universal Accessibility & Voice Reader Modal */}
      <AccessibilityToolbar
        isOpen={accessibilityModalOpen}
        onClose={() => setAccessibilityModalOpen(false)}
        speechTitle={item.title}
        speechText={`${item.title}। ${item.summary}। ${item.body.slice(0, 500)}`}
      />

      {/* Community Broadcast Modal */}
      <CommunityBroadcastModal
        isOpen={communityModalOpen}
        onClose={() => setCommunityModalOpen(false)}
        settings={settings}
      />
    </div>
  );
};
