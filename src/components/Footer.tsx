import React from 'react';
import { KhabarLogo } from './KhabarLogo';
import { ShieldCheck, Facebook, AlertCircle, Mail, MapPin } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (path: string) => void;
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Introduction */}
          <div className="space-y-4">
            <div className="bg-white/10 p-2 rounded-xl inline-block">
              <KhabarLogo size="sm" customUrl={settings?.customLogoUrl || '/logo.png'} title={settings?.siteTitle || 'Khabar GPT'} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings?.introTextNp ||
                'खबर GPT नेपालका समसामयिक विषय, सार्वजनिक सरोकारका जानकारी र जटिल विषयलाई सरल भाषामा बुझाउने सूचना पृष्ठ हो। हाम्रो उद्देश्य तथ्यमा आधारित, उपयोगी र जिम्मेवार जानकारी प्रस्तुत गर्नु हो।'}
            </p>
            {/* Dynamic Social Accounts & Community Channels */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {/* Primary Facebook */}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                  title="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}

              {/* YouTube */}
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                  title="YouTube Channel"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}

              {/* TikTok */}
              {settings?.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors"
                  title="TikTok Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.54c-.03 2.05-.8 4.11-2.28 5.57-1.57 1.56-3.79 2.37-6.03 2.19-2.08-.14-4.08-1.12-5.4-2.73-1.44-1.74-1.99-4.08-1.54-6.3.45-2.26 2.03-4.19 4.13-5.06 1.14-.48 2.39-.67 3.63-.58v4.14c-.69-.13-1.42-.09-2.08.15-.75.27-1.38.86-1.67 1.61-.31.78-.26 1.68.14 2.41.42.75 1.19 1.25 2.04 1.34 1.07.13 2.19-.34 2.79-1.22.45-.66.57-1.48.56-2.28V.02z"/>
                  </svg>
                </a>
              )}

              {/* Instagram */}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}

              {/* Twitter / X */}
              {settings?.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  title="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}

              {/* WhatsApp */}
              {settings?.whatsappUrl && (
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                  title="WhatsApp Community"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.394 0 0 5.394 0 12.031c0 2.115.55 4.179 1.594 5.992L.055 24l6.156-1.613a11.97 11.97 0 0 0 5.82 1.492c6.637 0 12.031-5.394 12.031-12.031C24.062 5.394 18.668 0 12.031 0zm0 21.996a9.92 9.92 0 0 1-5.066-1.385l-.364-.216-3.766.988 1.005-3.67-.236-.377a9.927 9.927 0 0 1-1.527-5.305c0-5.49 4.469-9.96 9.954-9.96 5.49 0 9.959 4.47 9.959 9.96 0 5.49-4.469 9.96-9.955 9.96zm5.457-7.464c-.299-.15-1.768-.873-2.042-.973-.274-.1-.473-.15-.672.15-.2.299-.773.973-.948 1.172-.174.2-.349.224-.648.075-.299-.15-1.263-.466-2.406-1.485-.89-.794-1.491-1.774-1.666-2.073-.174-.299-.019-.461.131-.61.135-.134.299-.349.449-.523.15-.174.2-.299.3-.499.1-.2.05-.374-.025-.523-.075-.15-.672-1.62-.922-2.219-.244-.583-.493-.504-.672-.513-.174-.009-.374-.01-.573-.01-.199 0-.523.075-.797.374-.274.299-1.047 1.022-1.047 2.493s1.072 2.892 1.221 3.091c.15.2 2.11 3.222 5.112 4.521.714.309 1.272.493 1.706.631.717.228 1.369.196 1.885.119.575-.086 1.768-.723 2.017-1.421.249-.698.249-1.296.174-1.42-.075-.125-.274-.2-.573-.349z"/>
                  </svg>
                </a>
              )}

              {/* Dynamic Added Social Links */}
              {settings?.socialLinks &&
                settings.socialLinks
                  .filter((l) => l.active && l.url)
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center gap-1 hover:bg-red-600 hover:text-white transition-colors"
                      title={link.label}
                    >
                      <span>{link.label}</span>
                    </a>
                  ))}

              {/* Email Button (Only rendered if official email is configured) */}
              {settings?.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                  title="इमेल पठाउनुहोस्"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              महत्त्वपूर्ण पृष्ठहरू
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  गृहपृष्ठ (Home)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/news')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  समाचार तथा अपडेटहरू (News Listing)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/explainers')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  एक्सप्लेनर शृङ्खला (Explainers)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/videos')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  भिडियो & Reels (Videos Hub)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  हाम्रोबारे (About Khabar GPT)
                </button>
              </li>
            </ul>
          </div>

          {/* Editorial & Legal Compliance */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              पारदर्शिता & नीतिहरू
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/editorial-standards')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>सम्पादकीय मापदण्ड (Editorial Standards)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/corrections')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>सच्याइ नीति (Corrections Policy)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  गोपनीयता नीति (Privacy Notice)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  प्रतिलिपि अधिकार तथा सर्तहरू (Copyright & Terms)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  सम्पर्क तथा दाबी (Contact & Inquiries)
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Status & Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              कानुनी स्थिति र सम्पर्क
            </h3>
            <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/50 text-xs text-slate-400 space-y-2 mb-3">
              <p className="font-medium text-slate-300">
                नेपाल कानुनी स्पष्टीकरण:
              </p>
              <p>
                खबर GPT हाल दर्ता भएको अनलाइन सञ्चारमाध्यम वा प्रेस होइन। यो सार्वजनिक सरोकारका विषयलाई सरल ढङ्गले प्रस्तुत गर्ने स्वतन्त्र डिजिटल सूचना पृष्ठ हो।
              </p>
            </div>
            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{settings?.address || 'काठमाडौँ, नेपाल'}</span>
              </div>
              {settings?.contactEmail ? (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="hover:text-white"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <a
                    href={settings?.facebookUrl || 'https://facebook.com/khabargpt'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white text-blue-400"
                  >
                    Khabar GPT Facebook Page
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {settings?.footerText ||
              '© २०२६ खबर GPT (Khabar GPT). सर्वाधिकार सुरक्षित। नेपालका कानुनहरूको सम्मान गर्दै जिम्मेवार सूचना प्रस्तुति।'}
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>नेपाल डिजिटल सूचना पहल</span>
            <span>·</span>
            <span>स्वतन्त्र तथा निष्पक्ष विश्लेषण</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
