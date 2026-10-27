import React, { useState } from 'react';
import {
  Facebook,
  Globe,
  Video,
  Image as ImageIcon,
  BadgeCheck,
  Clock,
  Maximize2,
  X,
  ExternalLink,
  Layers,
  AlertTriangle,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';
import {
  SiteSettings,
  ContentItem,
  PromotionServiceItem,
  VerifiedMetricItem,
  AnalyticsScreenshotItem
} from '../types';
import { api } from '../services/api';

/* =========================================================================
   SECTION 1: FACEBOOK PAGE PROMOTION (PRIMARY)
   ========================================================================= */
interface FacebookPromotionProps {
  services: PromotionServiceItem[];
  verifiedMetrics: VerifiedMetricItem[];
  screenshots: AnalyticsScreenshotItem[];
  sampleVideos: ContentItem[];
  onSelectServiceForEnquiry: (serviceId: string) => void;
  facebookUrl: string;
}

export const FacebookPromotionSection: React.FC<FacebookPromotionProps> = ({
  services,
  verifiedMetrics,
  screenshots,
  sampleVideos,
  onSelectServiceForEnquiry,
  facebookUrl
}) => {
  const [activeScreenshot, setActiveScreenshot] = useState<AnalyticsScreenshotItem | null>(null);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-blue-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-xs">
            <Facebook className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
              प्राथमिक प्रवर्द्धन माध्यम (Primary Platform)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Promote Your Business with Khabar GPT
            </h2>
          </div>
        </div>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Facebook className="w-3.5 h-3.5" />
          <span>फेसबुक पेजमा जानुहोस्</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        हाम्रो प्रमुख प्रकाशन गतिविधि र पाठक अन्तरक्रिया मुख्य रूपमा <strong>आधिकारिक फेसबुक पेज</strong>मा हुने भएकाले व्यवसायहरूले हाम्रो फेसबुक पेज मार्फत प्रवर्द्धनका सम्भावनाहरूबारे सोधपुछ गर्न सक्नुहुन्छ। सबै प्रवर्द्धन सेवाहरू व्यवस्थापकको समीक्षा र उपलब्धताको अधीनमा रहनेछन्:
      </p>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-2xl p-5 border shadow-2xs space-y-3 transition-all flex flex-col justify-between ${
              service.isAvailable ? 'border-blue-200 hover:border-blue-300' : 'border-slate-200 opacity-75'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                    {service.id.includes('video') || service.id.includes('reel') ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-tight">
                    {service.titleNp}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    service.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {service.isAvailable ? 'उपलब्ध सेवा' : 'हाल सीमित'}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                {service.title}
              </div>

              {/* Format, Deliverables & Duration */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5">
                <div className="flex items-baseline justify-between text-slate-600 gap-2">
                  <span className="font-medium text-slate-500 shrink-0">फर्म्याट:</span>
                  <span className="font-semibold text-slate-800 text-right">{service.format}</span>
                </div>
                <div className="flex items-baseline justify-between text-slate-600 gap-2">
                  <span className="font-medium text-slate-500 shrink-0">डिलिभरी:</span>
                  <span className="text-slate-800 text-right">{service.deliverables}</span>
                </div>
                <div className="flex items-baseline justify-between text-slate-600 gap-2">
                  <span className="font-medium text-slate-500 shrink-0">अवधि:</span>
                  <span className="font-semibold text-slate-800 text-right">{service.duration}</span>
                </div>
                {service.notes && (
                  <div className="pt-1 border-t border-slate-200/60 text-[11px] text-slate-500 italic">
                    नोट: {service.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Price & Quote Request */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">शुल्क (Pricing)</span>
                <span className="text-xs sm:text-sm font-bold text-blue-900 font-mono">
                  {service.priceType === 'fixed' && service.priceNpr
                    ? `रु ${service.priceNpr.toLocaleString()}`
                    : service.priceCustomText || 'Request a Quote'}
                </span>
              </div>

              <a
                href="#enquiry-form"
                onClick={() => onSelectServiceForEnquiry(service.id)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                सोधपुछ गर्नुहोस्
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 1.1 Verified Performance Summary (Authentic Data Only) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                प्रमाणित कार्यसम्पादन सारांश (Verified Performance Summary)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              यहाँ केवल आधिकारिक मेटा बिजनेस सुइट (Meta Business Suite) बाट प्रमाणित वास्तविक तथ्याङ्क मात्र प्रस्तुत गरिन्छ।
            </p>
          </div>

          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            कुनै अनुमानित संख्या समावेश छैन
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {verifiedMetrics.map((m) => (
            <div
              key={m.id}
              className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">{m.metricNameNp}</div>
                <div className="text-[10px] text-slate-400 font-mono">{m.metricName}</div>
              </div>

              <div className="py-1">
                {m.isVerified && m.value ? (
                  <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {m.value}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Updated analytics coming soon</span>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-500 border-t border-slate-200/80 pt-1.5 space-y-0.5 font-mono">
                <div>अवधि: {m.dateRange}</div>
                <div>स्रोत: {m.source}</div>
                {m.lastUpdatedDate && <div>अद्यावधिक: {m.lastUpdatedDate}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>पारदर्शिता मापदण्ड:</strong> हामी आजीवन (Lifetime) भ्युजलाई मासिक पहुँचसँग मिसाउँदैनौँ वा विभिन्न रिपोर्टिङ अवधिलाई अप्राकृतिक रूपमा तुलना गर्दैनौँ। यदि नयाँ तथ्याङ्क प्रमाणीकरण हुन बाँकी छ भने स्पष्ट रूपमा <em>"Updated analytics coming soon"</em> देखाइन्छ।
          </p>
        </div>
      </div>

      {/* 1.2 Genuine Analytics Gallery (Owner-Supplied Authentic Screenshots) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <span>प्रमाणित एनालिटिक्स स्क्रिनसटहरू (Genuine Analytics Gallery)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              व्यवस्थापकद्वारा उपलब्ध गराइएका आधिकारिक मेटा बिजनेस सुइट इनसाइट्सका अप्रशोधित स्क्रिनसटहरू:
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            क्लिक गरी पूर्ण आकारमा हेर्नुहोस्
          </span>
        </div>

        {screenshots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {screenshots.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveScreenshot(item)}
                className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-400 transition cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-xs"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-102 transition duration-200"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="p-2 bg-white/90 rounded-full text-slate-900 shadow-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div>
                      <strong>मेट्रिक:</strong> {item.metricShown}
                    </div>
                    <div>
                      <strong>रिपोर्टिङ अवधि:</strong> {item.reportingPeriod}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      स्रोत: {item.source}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-medium text-slate-700">
              आधिकारिक स्क्रिनसटहरू चाँडै उपलब्ध हुनेछन् (Verified screenshots coming soon)
            </p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              हामी नक्कली वा एआई-निर्मित ड्यासबोर्ड प्रयोग गर्दैनौँ। फेसबुक पेजको पछिल्लो रिपोर्टिङ अवधिको वास्तविक मेटा इनसाइट्स स्क्रिनसट व्यवस्थापकद्वारा अपलोड भएपछि यहाँ प्रदर्शित हुनेछ।
            </p>
          </div>
        )}
      </div>

      {/* 1.3 Examples of Actual Published Content */}
      {sampleVideos.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-red-600" />
              <span>वास्तविक प्रकाशित सामग्रीका उदाहरणहरू (Examples of Actual Published Content)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              खबर GPT द्वारा आधिकारिक फेसबुक पेजमा प्रकाशित वास्तविक भिडियो तथा विश्लेषणहरूको ढाँचा:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sampleVideos.map((v) => (
              <div
                key={v.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-block">
                    {v.category}
                  </span>
                  <h4 className="font-bold text-slate-900 line-clamp-2">{v.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{v.summary}</p>
                </div>

                <a
                  href={v.facebookPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-[11px] pt-1"
                >
                  <span>फेसबुकमा हेर्नुहोस्</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeScreenshot && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 space-y-3 my-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                {activeScreenshot.title}
              </h3>
              <button
                onClick={() => setActiveScreenshot(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto rounded-xl bg-slate-950 flex items-center justify-center p-2">
              <img
                src={activeScreenshot.imageUrl}
                alt={activeScreenshot.title}
                className="max-h-[66vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div>
                <strong className="text-slate-800">देखाइएको मेट्रिक:</strong> {activeScreenshot.metricShown}
              </div>
              <div>
                <strong className="text-slate-800">रिपोर्टिङ अवधि:</strong> {activeScreenshot.reportingPeriod}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                <strong>स्रोत:</strong> {activeScreenshot.source}
              </div>
              {activeScreenshot.notes && (
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <strong>थप विवरण:</strong> {activeScreenshot.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* =========================================================================
   SECTION 2: WEBSITE PROMOTION (SECONDARY)
   ========================================================================= */
interface WebsitePromotionProps {
  services: PromotionServiceItem[];
  trafficDisclaimer?: string;
  onSelectServiceForEnquiry: (serviceId: string) => void;
}

export const WebsitePromotionSection: React.FC<WebsitePromotionProps> = ({
  services,
  trafficDisclaimer,
  onSelectServiceForEnquiry
}) => {
  return (
    <section className="space-y-6 pt-6 border-t-2 border-slate-100">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-slate-800 text-white rounded-2xl shadow-xs">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block">
              सहायक प्रवर्द्धन माध्यम (Secondary Platform)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Promote Your Brand on the Khabar GPT Website
            </h2>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          वेबसाइट: khabargpt.onrender.com
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        हाम्रो वेबसाइटमा हाल कार्यान्वयन भएका र प्रत्यक्ष रूपमा उपलब्ध विज्ञापन सेवाहरू निम्न अनुसार छन्। वेबसाइट विज्ञापन मुख्य फेसबुक पेजको सहायक सेवाका रूपमा उपलब्ध गराइन्छ:
      </p>

      {/* Website Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <Layers className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {service.titleNp}
                </h3>
              </div>

              <div className="text-[10px] font-mono text-slate-400">{service.title}</div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1">
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">फर्म्याट: </span>
                  {service.format}
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">डिलिभरी: </span>
                  {service.deliverables}
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">अवधि: </span>
                  {service.duration}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">शुल्क</span>
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {service.priceType === 'fixed' && service.priceNpr
                    ? `रु ${service.priceNpr.toLocaleString()}`
                    : service.priceCustomText || 'Request a Quote'}
                </span>
              </div>

              <a
                href="#enquiry-form"
                onClick={() => onSelectServiceForEnquiry(service.id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                सोधपुछ
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Strict Traffic Transparency Box */}
      <div className="p-4 bg-slate-100/90 rounded-2xl border border-slate-300 text-xs text-slate-700 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>वेबसाइट ट्राफिक तथा दाबी सम्बन्धी पारदर्शी नीति (No Fabricated Traffic Claims):</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {trafficDisclaimer ||
            'खबर GPT ले वेबसाइट ट्राफिक, सर्च र्‍याङ्किङ, क्लिक वा बिक्री सम्बन्धी कुनै पनि मनगढन्ते वा अवास्तविक ग्यारेन्टी दिँदैन। वेबसाइटको वास्तविक भिजिटर तथ्याङ्क व्यवस्थापकद्वारा प्रमाणित भए पश्चात मात्र सार्वजनिक गरिन्छ।'}
        </p>
      </div>
    </section>
  );
};

/* =========================================================================
   SECTION 3: COLLABORATION ENQUIRY FORM
   ========================================================================= */
interface EnquiryFormProps {
  fbServices: PromotionServiceItem[];
  webServices: PromotionServiceItem[];
  initialServiceId?: string;
  initialPromoType?: 'facebook' | 'website' | 'both';
  facebookUrl: string;
}

export const CollaborationEnquiryForm: React.FC<EnquiryFormProps> = ({
  fbServices,
  webServices,
  initialServiceId = 'fb-service-1',
  initialPromoType = 'facebook',
  facebookUrl
}) => {
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [contactMethodType, setContactMethodType] = useState<'email' | 'whatsapp' | 'facebook'>('email');
  const [promotionType, setPromotionType] = useState<'facebook' | 'website' | 'both'>(initialPromoType);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [productDescription, setProductDescription] = useState('');
  const [desiredDates, setDesiredDates] = useState('');
  const [budget, setBudget] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<{ ticketId: string; businessName: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !contactPerson.trim() || !contactMethod.trim() || !productDescription.trim()) {
      setFormError('कृपया व्यवसायको नाम, सम्पर्क व्यक्ति, सम्पर्क माध्यम र उत्पादन/सेवाको विवरण अनिवार्य रूपमा भर्नुहोस्।');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const promoTypeLabel =
      promotionType === 'facebook'
        ? 'फेसबुक पेज प्रवर्द्धन (Facebook Page Promotion - Primary)'
        : promotionType === 'website'
        ? 'वेबसाइट प्रवर्द्धन (Website Promotion - Secondary)'
        : 'फेसबुक र वेबसाइट दुवै (Both Facebook & Website)';

    const allServices = [...fbServices, ...webServices];
    const chosenService = allServices.find((s) => s.id === selectedServiceId);
    const chosenServiceLabel = chosenService ? `${chosenService.titleNp} (${chosenService.title})` : 'अनुकूलित / अन्य';

    const fullMessage = `=== नयाँ विज्ञापन तथा सहकार्य सोधपुछ (New Collaboration Enquiry) ===
व्यवसाय / ब्रान्डको नाम: ${businessName.trim()}
सम्पर्क व्यक्ति: ${contactPerson.trim()}
सम्पर्क माध्यम (${contactMethodType.toUpperCase()}): ${contactMethod.trim()}
प्रवर्द्धनको प्रकार: ${promoTypeLabel}
छानिएको सेवा: ${chosenServiceLabel}
प्रस्तावित मिति / अवधि: ${desiredDates.trim() || 'लचिलो / छलफल अनुसार'}
बजेट (ऐच्छिक): ${budget.trim() || 'छलफल गर्न बाँकी (To be quoted)'}

उत्पादन वा सेवाको विवरण:
${productDescription.trim()}

थप आवश्यकता वा प्रश्नहरू:
${additionalRequirements.trim() || 'कुनै छैन'}
`;

    try {
      const emailValue = contactMethodType === 'email' ? contactMethod.trim() : 'inquiry@khabargpt.com';
      const phoneValue = contactMethodType === 'whatsapp' ? contactMethod.trim() : undefined;

      const res = await api.sendContactMessage({
        name: contactPerson.trim(),
        email: emailValue,
        phone: phoneValue,
        subject: `[प्रायोजन सोधपुछ] ${businessName.trim()} - ${chosenService?.titleNp || promoTypeLabel}`,
        type: 'sponsorship',
        message: fullMessage
      });

      const generatedTicket = res.ticketId || `KG-SPONSOR-${Date.now().toString().slice(-6)}`;
      setSuccessTicket({
        ticketId: generatedTicket,
        businessName: businessName.trim()
      });

      // Reset form
      setBusinessName('');
      setContactPerson('');
      setContactMethod('');
      setProductDescription('');
      setDesiredDates('');
      setBudget('');
      setAdditionalRequirements('');
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'सोधपुछ पठाउन सकिएन। कृपया केही समयपछि पुनः प्रयास गर्नुहोस्।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="enquiry-form" className="space-y-6 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full mb-1">
          <Mail className="w-3.5 h-3.5" />
          <span>आधिकारिक सोधपुछ फारम (Enquiry Form)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          व्यावसायिक प्रवर्द्धन सोधपुछ पठाउनुहोस् (Send Collaboration Enquiry)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          आफ्नो ब्रान्ड वा अभियानको आवश्यकता उल्लेख गरी फारम भर्नुहोस्। व्यवस्थापकले प्रस्तावको समीक्षा गरी २४ घण्टाभित्र सम्पर्क गर्नेछन्।
        </p>
      </div>

      {successTicket ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl p-6 sm:p-8 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-sm">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-100">
                सोधपुछ सफलतापूर्वक पठाइयो! (Enquiry Submitted Successfully)
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                {successTicket.businessName} का लागि तपाईंको प्रस्ताव सुरक्षित रूपमा प्राप्त भएको छ।
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">सन्दर्भ टिकट नम्बर (Reference ID):</span>
              <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                {successTicket.ticketId}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed pt-1">
              हाम्रो सम्पादकीय टोलीले तपाईंको सामग्री र ब्रान्डको समीक्षा गरी उपयुक्त ढाँचा र सम्भावित क्याम्पेन मिति सहित छिट्टै जवाफ पठाउनेछ।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition"
            >
              <Facebook className="w-4 h-4" />
              <span>फेसबुक मेसेन्जरमा सिधै सम्पर्क गर्नुहोस्</span>
            </a>
            <button
              type="button"
              onClick={() => setSuccessTicket(null)}
              className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold cursor-pointer transition"
            >
              अर्को सोधपुछ फारम भर्नुहोस्
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-slate-900 dark:text-white">
          {formError && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl text-xs font-semibold text-red-900 dark:text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                व्यवसाय वा ब्रान्डको नाम (Business / Brand Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="उदा: Ncell, Global IME, वा स्थानीय व्यवसाय"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                सम्पर्क व्यक्तिको नाम (Contact Person's Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="उदा: सुजन अधिकारी"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Preferred Contact Method - Direct Phone removed per user request */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                सम्पर्क माध्यम (Contact Method) *
              </label>
              <select
                value={contactMethodType}
                onChange={(e: any) => setContactMethodType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-colors shadow-2xs cursor-pointer"
              >
                <option value="email" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">इमेल (Email Address)</option>
                <option value="whatsapp" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">WhatsApp / Viber</option>
                <option value="facebook" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">फेसबुक प्रोफाइल / पेज लिङ्क</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                {contactMethodType === 'email'
                  ? 'इमेल ठेगाना (Email)'
                  : contactMethodType === 'whatsapp'
                  ? 'WhatsApp / Viber नम्बर'
                  : 'फेसबुक लिङ्क (Facebook Profile / Page URL)'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type={contactMethodType === 'email' ? 'email' : 'text'}
                required
                placeholder={
                  contactMethodType === 'email'
                    ? 'उदा: marketing@company.com'
                    : contactMethodType === 'whatsapp'
                    ? 'उदा: +977-98XXXXXXXX वा अन्तर्राष्ट्रिय नम्बर'
                    : 'उदा: https://facebook.com/yourbrand'
                }
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Promotion Type & Service Choice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                प्रवर्द्धनको प्रकार (Promotion Type) *
              </label>
              <select
                value={promotionType}
                onChange={(e: any) => {
                  const newType = e.target.value;
                  setPromotionType(newType);
                  if (newType === 'website') {
                    setSelectedServiceId(webServices[0]?.id || 'web-service-1');
                  } else {
                    setSelectedServiceId(fbServices[0]?.id || 'fb-service-1');
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-colors shadow-2xs cursor-pointer"
              >
                <option value="facebook" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">फेसबुक पेज प्रवर्द्धन (Facebook Page - Primary)</option>
                <option value="website" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">वेबसाइट प्रवर्द्धन (Website - Secondary)</option>
                <option value="both" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">फेसबुक र वेबसाइट दुवै (Both Platforms)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                रुचाइएको सेवा (Specific Service)
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-colors shadow-2xs cursor-pointer"
              >
                {(promotionType === 'website' ? webServices : fbServices).map((s) => (
                  <option key={s.id} value={s.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                    {s.titleNp} ({s.priceCustomText || 'Request a Quote'})
                  </option>
                ))}
                {promotionType === 'both' && (
                  <option value="custom_both" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">कम्बो प्याकेज (फेसबुक + वेबसाइट संयुक्त)</option>
                )}
              </select>
            </div>
          </div>

          {/* Product / Service Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              उत्पादन वा सेवाको विवरण (Product or Service Description) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="तपाईंको व्यवसाय के हो र के सन्देश वा सेवा पाठकहरूमाझ प्रवर्द्धन गर्न चाहनुहुन्छ?"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden leading-relaxed transition-colors shadow-2xs"
            />
          </div>

          {/* Dates & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                प्रस्तावित क्याम्पेन मिति वा समय (Desired Campaign Dates)
              </label>
              <input
                type="text"
                placeholder="उदा: आगामी हप्ता, दसैँ अफर, वा १ महिना"
                value={desiredDates}
                onChange={(e) => setDesiredDates(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-colors shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                अनुमानित बजेट (Budget - Optional)
              </label>
              <input
                type="text"
                placeholder="उदा: रु १०,००० - २५,००० वा छलफल बाँकी"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* Additional Requirements */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              थप आवश्यकता वा प्रश्नहरू (Additional Requirements - Optional)
            </label>
            <textarea
              rows={2}
              placeholder="कुनै विशेष सर्त, डिजाइन आवश्यकता वा सोधपुछ..."
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden leading-relaxed transition-colors shadow-2xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-600 dark:text-slate-400">
              🔒 तपाईंको सम्पर्क विवरण गोप्य राखिन्छ र तेस्रो पक्षलाई प्रदान गरिँदैन।
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'पठाउँदै...' : 'सोधपुछ पठाउनुहोस् (Submit Enquiry)'}</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

/* =========================================================================
   SECTION 4: TRUST & TRANSPARENCY
   ========================================================================= */
interface TrustTransparencyProps {
  editorialDisclaimer?: string;
  notRegisteredPressNotice?: string;
}

export const TrustTransparencySection: React.FC<TrustTransparencyProps> = ({
  editorialDisclaimer,
  notRegisteredPressNotice
}) => {
  return (
    <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-800">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            विश्वास, पारदर्शि सम्पादकीय मापदण्ड तथा कानुनी सूचना (Trust & Transparency)
          </h3>
          <p className="text-xs text-slate-400">
            खबर GPT का सम्पादकीय तथा विज्ञापन मापदण्डहरू:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
        <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
          <span className="font-bold text-white flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span>स्पष्ट विज्ञापन लेबल (Clearly Labeled Promotions)</span>
          </span>
          <p className="leading-relaxed text-[11px] text-slate-300">
            सबै प्रायोजित सामग्री, फेसबुक पोस्ट वा ब्यानरहरूमा <em>"प्रायोजित सामग्री / Sponsored Promotion"</em> को स्पष्ट लेबल राखिन्छ। पाठकलाई झुक्याउने किसिमले समाचारका रूपमा विज्ञापन सम्प्रेषण गरिँदैन।
          </p>
        </div>

        <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
          <span className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>सम्पादकीय समीक्षा तथा पूर्वस्वीकृति</span>
          </span>
          <p className="leading-relaxed text-[11px] text-slate-300">
            {editorialDisclaimer ||
              'हामी सबै विज्ञापन प्रस्तावहरूलाई सम्पादकीय मापदण्ड र सार्वजनिक हितका आधारमा समीक्षा गर्दछौँ। जुवा, सट्टेबाजी, भ्रामक वित्तीय योजना, गैरकानुनी वा अश्लील सामग्रीको प्रवर्द्धन कुनै पनि हालतमा स्वीकार गरिने छैन।'}
          </p>
        </div>

        <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
          <span className="font-bold text-white flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-blue-400" />
            <span>स्वतन्त्र सूचना पृष्ठ (Not a Registered Media)</span>
          </span>
          <p className="leading-relaxed text-[11px] text-slate-300">
            {notRegisteredPressNotice ||
              'खबर GPT नेपाल सरकारको सूचना तथा प्रसारण विभाग वा प्रेस काउन्सिलमा दर्ता भएको औपचारिक समाचार संस्था वा प्रेस होइन; यो एक स्वतन्त्र डिजिटल सूचना तथा विश्लेषण पृष्ठ हो।'}
          </p>
        </div>

        <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>सत्य तथ्याङ्क ग्यारेन्टी (Zero Fake Claims)</span>
          </span>
          <p className="leading-relaxed text-[11px] text-slate-300">
            हामी कुनै पनि नक्कली क्लाइन्ट लोगो, काल्पनिक प्रशंसापत्र (testimonials), वा मनगढन्ते अडियन्स ग्यारेन्टी प्रदर्शन गर्दैनौँ। केवल वास्तविक प्रमाण र सत्य जानकारी मात्र प्रस्तुत गरिन्छ।
          </p>
        </div>
      </div>
    </section>
  );
};
