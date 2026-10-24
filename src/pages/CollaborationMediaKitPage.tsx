import React, { useState } from 'react';
import {
  Handshake,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  FileText,
  ShieldCheck,
  Building,
  Sparkles,
  Phone,
  ExternalLink,
  Info,
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-react';
import { KhabarLogo } from '../components/KhabarLogo';
import { SiteSettings, ContentItem } from '../types';
import { api } from '../services/api';

interface CollaborationMediaKitPageProps {
  settings?: SiteSettings;
  content?: ContentItem[];
  onNavigate?: (path: string) => void;
}

export const CollaborationMediaKitPage: React.FC<CollaborationMediaKitPageProps> = ({
  settings,
  content = [],
  onNavigate
}) => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [collaborationType, setCollaborationType] = useState('explainer');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('कृपया नाम, इमेल र सन्देश अनिवार्य रूपमा भर्नुहोस्।');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const fullMessage = `[प्रस्ताव प्रकार: ${collaborationType}] [संस्था: ${organization.trim() || 'व्यक्तिगत'}] [फोन: ${phone.trim() || 'नखुलाइएको'}]\n\n${message.trim()}`;
      await api.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: `व्यावसायिक सहकार्य प्रस्ताव: ${organization.trim() || name.trim()} (${collaborationType})`,
        type: 'sponsorship',
        message: fullMessage
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setOrganization('');
      setMessage('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'प्रस्ताव पठाउन सकिएन। पछि पुन: प्रयास गर्नुहोस्।');
    } finally {
      setSubmitting(false);
    }
  };

  const publishedCount = content.filter((c) => c.status === 'published').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <KhabarLogo size="sm" customUrl={settings?.customLogoUrl || '/logo.png'} title={settings?.siteTitle || 'Khabar GPT'} />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block">
              व्यावसायिक सहकार्य तथा मिडिया किट
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              सहकार्य तथा प्रायोजन प्रस्ताव (Collaboration & Media Kit)
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          खबर GPT नेपालका समसामयिक विषय, नागरिक सरोकारका जानकारी र ज्ञानमूलक विश्लेषण प्रस्तुत गर्ने स्वतन्त्र डिजिटल सूचना पृष्ठ हो। हामी सत्य, तथ्य र सार्वजनिक हितलाई प्राथमिकता दिने नैतिक व्यवसाय, सिर्जनात्मक साझेदार र सामाजिक अभियानहरूसँग सहकार्यका लागि खुला छौँ।
        </p>

        {/* Clear Legal & Editorial Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs text-amber-950 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>सहकार्य सम्बन्धी पूर्वसर्त र स्पष्टोक्ति (Mandatory Disclosures):</span>
          </div>
          <p className="leading-relaxed text-amber-900">
            कुनै पनि सोधपुछ वा फाराम पेश गर्दैमा सामग्री प्रकाशन हुने, निश्चित पहुँच (Reach) पुग्ने वा व्यावसायिक लाभ प्राप्त हुने कुनै ग्यारेन्टी हुँदैन। सबै प्रायोजित वा सहकार्यका सामग्रीहरू सञ्चालक/सम्पादकीय टोलीको स्वीकृति र नेपालको विज्ञापन नियमावली बमोजिम स्पष्ट रूपमा <strong>"प्रायोजित (Sponsored)"</strong> ट्यागसहित मात्र प्रकाशित गरिन्छ।
          </p>
        </div>
      </div>

      {/* 2. Genuine Platform Overview (No Fake Metrics) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-red-600" />
          <span>हाम्रा मुख्य सामर्थ्य र प्लेटफर्म विवरण</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-500 uppercase font-bold block">
              डिजिटल अभिलेख
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {publishedCount > 0 ? `${publishedCount}+` : 'सक्रिय'}
            </div>
            <p className="text-xs text-slate-600">
              प्रकाशन गरिएका तथ्यपरक विश्लेषण, भिडियो र समाचार सारांशहरू
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-500 uppercase font-bold block">
              पारदर्शिता नीति
            </span>
            <div className="text-base font-bold text-emerald-800">
              १००% तथ्य-केन्द्रित
            </div>
            <p className="text-xs text-slate-600">
              पारदर्शी सम्पादकीय मापदण्ड र सार्वजनिक सच्याइ (Corrections) नीति
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <span className="text-[11px] text-slate-500 uppercase font-bold block">
              फेसबुक समुदाय
            </span>
            <div className="text-base font-bold text-blue-700">
              आधिकारिक पेज
            </div>
            <p className="text-xs text-slate-600">
              सक्रिय नेपाली दर्शक र पाठकहरूसम्म डिजिटल भिडियो तथा पोस्ट पहुँच
            </p>
          </div>
        </div>
      </div>

      {/* 3. Opportunities for Collaboration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase">
            <Sparkles className="w-4 h-4" />
            <span>१. शैक्षिक तथा चेतनामूलक एक्सप्लेनर</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            तपाईंको क्षेत्रका जटिल विषयलाई सरल भाषामा बुझाउने
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            स्वास्थ्य, वित्तीय साक्षरता, प्रविधि वा कानुनी सचेतना सम्बन्धी सार्वजनिक जानकारी सरल इन्फोग्राफिक्स तथा व्याख्यात्मक लेखमार्फत प्रस्तुत गर्न सकिन्छ।
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase">
            <Building className="w-4 h-4" />
            <span>२. चाडपर्व तथा विशेष अवसरको शुभकामना</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            नेपाली चाडपर्वमा डिजिटल कार्ड र सन्देश
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            दशैं, तिहार, नयाँ वर्ष वा अन्य उत्सवहरूमा ब्रान्डेड पोस्टर स्टुडियो वा विशेष ब्यानरमार्फत दर्शकहरूसँग सकारात्मक सम्बन्ध स्थापना गर्नुहोस्।
          </p>
        </div>
      </div>

      {/* 4. Sponsorship & Enquiry Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
            <Mail className="w-4 h-4" />
            <span>प्रस्ताव फाराम (Enquiry Form)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            सहकार्यको लागि आफ्नो विवरण पठाउनुहोस्
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            कृपया आफ्नो संस्था, सहकार्यको उद्देश्य र अपेक्षा स्पष्ट रूपमा उल्लेख गर्नुहोला।
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2 animate-in fade-in">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-950">
              तपाईंको प्रस्ताव सफलतापूर्वक प्राप्त भयो!
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
              धन्यवाद! हाम्रो टिमले तपाईंको प्रस्तावको अध्ययन गरी सम्भाव्यता र नीतिगत अनुकूलताका आधारमा छिट्टै सम्पर्क गर्नेछ।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  सम्पर्क व्यक्तिको नाम *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 font-medium"
                  placeholder="तपाईंको पूरा नाम"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  इमेल ठेगाना *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  संस्था / व्यवसायको नाम
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
                  placeholder="कम्पनी वा अभियानको नाम"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  फोन नम्बर (ऐच्छिक)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500"
                  placeholder="९८xxxxxxxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                सहकार्यको प्रकृति (Collaboration Type)
              </label>
              <select
                value={collaborationType}
                onChange={(e) => setCollaborationType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 bg-white"
              >
                <option value="explainer">प्रायोजित शैक्षिक एक्सप्लेनर (Educational Explainer)</option>
                <option value="festival">चाडपर्व शुभकामना साझेदारी (Festival Greetings)</option>
                <option value="digital-ad">डिजिटल ब्यानर वा पोस्टर प्रवर्द्धन (Digital Poster Promo)</option>
                <option value="content-partnership">सामग्री तथा अनुसन्धान साझेदारी (Content Partnership)</option>
                <option value="other">अन्य व्यावसायिक सोधपुछ (Other Inquiries)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                प्रस्तावको संक्षिप्त विवरण (Proposal Brief / Message) *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-red-500 leading-relaxed"
                placeholder="तपाईंको सहकार्यको मुख्य उद्देश्य, समयसीमा र बजेट दायरा भए उल्लेख गर्नुहोस्..."
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'प्रस्ताव पठाउँदै...' : 'सहकार्य प्रस्ताव पठाउनुहोस्'}</span>
            </button>
          </form>
        )}
      </div>

      {/* 5. Direct Contact Channels (Only configured ones) */}
      {settings?.contactEmail && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <span>सिधा आधिकारिक इमेल: <strong>{settings.contactEmail}</strong></span>
          </div>
          <a
            href={`mailto:${settings.contactEmail}?subject=Collaboration%20Inquiry`}
            className="text-red-600 hover:underline font-bold"
          >
            इमेल लेख्नुहोस् →
          </a>
        </div>
      )}
    </div>
  );
};
