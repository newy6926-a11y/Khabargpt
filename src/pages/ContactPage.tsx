import React, { useState } from 'react';
import { api } from '../services/api';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, ShieldAlert, Facebook, MessageCircle, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../types';

interface ContactPageProps {
  settings: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    type: 'general',
    message: '',
    website_trap: '' // Honeypot field
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('कृपया नाम, इमेल, विषय र सन्देश भर्नुहोस्।');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitContact(formData);
      setSuccess(res.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        type: 'general',
        message: '',
        website_trap: ''
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'सन्देश पठाउन सकिएन।');
    } finally {
      setLoading(false);
    }
  };

  const hasEmail = Boolean(settings.contactEmail && settings.contactEmail.trim());

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
          सम्पर्क तथा प्रतिक्रिया (Contact & Inquiries)
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          सल्लाह, सुझाव, सच्याइ अनुरोध, प्रतिलिपि अधिकार दाबी वा सोधपुछका लागि हामीलाई सिधै सम्पर्क गर्नुहोस्।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info Sidebar */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs text-slate-700">
            <h3 className="text-sm font-bold text-slate-900">आधिकारिक सम्पर्क विवरण</h3>

            {hasEmail && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-slate-900">इमेल ठेगाना:</span>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-blue-600 hover:underline break-all"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-900">ठेगाना:</span>
                <span>{settings.address || 'काठमाडौँ, नेपाल'}</span>
              </div>
            </div>

            {/* Social channels outreach */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <span className="font-semibold block text-slate-900 text-xs">सामाजिक सञ्जालमा सन्देश:</span>
              <a
                href={settings.facebookUrl || 'https://facebook.com/khabargpt'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Facebook className="w-3.5 h-3.5" />
                  <span>फेसबुक मेसेन्जरमा सम्पर्क</span>
                </div>
                <ExternalLink className="w-3 h-3" />
              </a>

              {settings.whatsappUrl && (
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>ह्वाट्सएपमा सन्देश</span>
                  </div>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-blue-700" />
              <span>सच्याइ र प्रतिलिपि अधिकार अनुरोध</span>
            </div>
            <p className="leading-relaxed">
              यदि तपाईं कुनै सामग्रीमा भएको गल्ती सच्याउन वा प्रतिलिपि अधिकार (Copyright) सम्बन्धी उजुरी गर्न चाहनुहुन्छ भने, फाराममा विषयको प्रकार सही छान्नुहोस् र प्रमाणसहित पठाउनुहोस्। हामी २४ देखि ४८ घण्टाभित्र समीक्षा गर्छौँ।
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4"
          >
            {/* Honeypot hidden input */}
            <div className="hidden" aria-hidden="true">
              <label>Website</label>
              <input
                type="text"
                value={formData.website_trap}
                onChange={(e) => setFormData({ ...formData, website_trap: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  तपाईंको नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा: राम श्रेष्ठ"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  इमेल ठेगाना <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                सम्पर्कको उद्देश्य / प्रकार <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
              >
                <option value="general">सामान्य सोधपुछ वा सुझाव (General Inquiry)</option>
                <option value="correction">तथ्य सच्याउने अनुरोध (Correction Request)</option>
                <option value="copyright">प्रतिलिपि अधिकार सम्बन्धी (Copyright Issue)</option>
                <option value="privacy">गोपनीयता सम्बन्धी गुनासो (Privacy Concern)</option>
                <option value="sponsorship">व्यावसायिक / प्रायोजन सम्बन्धी (Business & Sponsorship)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                विषय (Subject) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="सङ्क्षिप्त विषय खुलाउनुहोस्"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                विस्तृत सन्देश / विवरण <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="आफ्नो विचार वा अनुरोध स्पष्टसँग लेख्नुहोस्..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-500 resize-y"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'पठाउँदै...' : 'सन्देश पठाउनुहोस् (Send Message)'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
