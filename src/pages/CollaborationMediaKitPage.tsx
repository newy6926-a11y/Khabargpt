import React, { useState, useEffect } from 'react';
import {
  Facebook,
  Globe,
  Share2,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import {
  SiteSettings,
  ContentItem,
  PromotionServiceItem,
  VerifiedMetricItem,
  AnalyticsScreenshotItem,
  CollaboratePageConfig
} from '../types';
import {
  FacebookPromotionSection,
  WebsitePromotionSection,
  CollaborationEnquiryForm,
  TrustTransparencySection
} from '../components/CollaborateComponents';

interface CollaborationMediaKitPageProps {
  settings?: SiteSettings;
  content?: ContentItem[];
  onNavigate?: (path: string) => void;
}

export const CollaborationMediaKitPage: React.FC<CollaborationMediaKitPageProps> = ({
  settings: propSettings,
  content: propContent,
  onNavigate
}) => {
  const [settings, setSettings] = useState<SiteSettings | null>(propSettings || null);
  const [videos, setVideos] = useState<ContentItem[]>(
    propContent?.filter((c: ContentItem) => c.type === 'video' || !!c.videoUrl) || []
  );
  const [isLoading, setIsLoading] = useState(!propSettings);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('fb-post');

  useEffect(() => {
    if (propSettings) {
      setSettings(propSettings);
    }
    if (propContent && propContent.length > 0) {
      setVideos(propContent.filter((c: ContentItem) => c.type === 'video' || !!c.videoUrl));
    }

    if (!propSettings || !propContent || propContent.length === 0) {
      const fetchData = async () => {
        try {
          const [fetchedSettings, fetchedContent] = await Promise.all([
            !propSettings ? api.getSettings() : Promise.resolve(null),
            (!propContent || propContent.length === 0) ? api.getContent({ type: 'video' }) : Promise.resolve(null)
          ]);
          if (fetchedSettings) {
            setSettings(fetchedSettings);
          }
          if (fetchedContent) {
            setVideos(fetchedContent.filter((c: ContentItem) => c.type === 'video' || !!c.videoUrl));
          }
        } catch (err) {
          console.error('Failed to load collaborate page data', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [propSettings, propContent]);

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const formEl = document.getElementById('enquiry-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const config: CollaboratePageConfig | undefined = settings?.collaborateConfig;

  // Facebook services (primary) vs Website services (secondary)
  const fbServices: PromotionServiceItem[] = config?.fbServices || [];
  const webServices: PromotionServiceItem[] = config?.webServices || [];
  const metrics: VerifiedMetricItem[] = config?.verifiedMetrics || [];
  const screenshots: AnalyticsScreenshotItem[] = config?.analyticsScreenshots || [];
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com/khabargpt';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-6 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Top Banner */}
        <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>प्रवर्द्धन तथा सहकार्य (Collaboration & Media Kit)</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                खबर GPT मार्फत आफ्नो व्यवसाय प्रवर्द्धन गर्नुहोस्
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                हाम्रो मुख्य डिजिटल गतिविधि र पाठकवर्ग फेसबुक पेजमा केन्द्रित छ। आफ्नो लक्षित ग्राहकसम्म आधिकारिक, मर्यादित र प्रभावकारी रूपमा पुग्न हामीसँग सहकार्य गर्नुहोस्।
              </p>
            </div>

            {/* Quick jump pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <a
                href="#facebook-promotion"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition shadow-xs"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>फेसबुक प्रवर्द्धन (मुख्य सेवा)</span>
              </a>
              <a
                href="#website-promotion"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>वेबसाइट प्रवर्द्धन (सहायक)</span>
              </a>
              <a
                href="#enquiry-form"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium rounded-xl border border-slate-700 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>सोझै सोधपुछ फारम</span>
              </a>
            </div>
          </div>
        </div>

        {/* SECTION 1: FACEBOOK PAGE PROMOTION (PRIMARY) */}
        <div id="facebook-promotion">
          <FacebookPromotionSection
            services={fbServices}
            verifiedMetrics={metrics}
            screenshots={screenshots}
            sampleVideos={videos}
            onSelectServiceForEnquiry={handleSelectService}
            facebookUrl={facebookUrl}
          />
        </div>

        {/* SECTION 2: WEBSITE PROMOTION (SECONDARY) */}
        <div id="website-promotion">
          <WebsitePromotionSection
            services={webServices}
            trafficDisclaimer={config?.webTrafficDisclaimer}
            onSelectServiceForEnquiry={handleSelectService}
          />
        </div>

        {/* SECTION 3: COLLABORATION ENQUIRY FORM */}
        <div id="enquiry-form">
          <CollaborationEnquiryForm
            fbServices={fbServices}
            webServices={webServices}
            initialServiceId={selectedServiceId}
            facebookUrl={facebookUrl}
          />
        </div>

        {/* SECTION 4: TRUST AND TRANSPARENCY */}
        <TrustTransparencySection
          editorialDisclaimer={config?.editorialDisclaimer}
          notRegisteredPressNotice={config?.notRegisteredPressNotice}
        />
      </div>
    </div>
  );
};
