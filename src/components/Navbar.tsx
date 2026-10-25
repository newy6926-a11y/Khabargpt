import React, { useState } from 'react';
import { KhabarLogo } from './KhabarLogo';
import { NepaliDateClock } from './NepaliDateClock';
import {
  ExternalLink,
  Menu,
  X,
  Zap,
  Share2,
  Calendar,
  MessageCircle,
  Mail,
  Eye,
  Type,
  Sparkles,
  Settings
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  settings?: SiteSettings;
  onOpenNepaliCalendar?: () => void;
  onOpenAccessibility?: () => void;
  onOpenCommunity?: () => void;
  onOpenDailyDigest?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  settings,
  onOpenNepaliCalendar,
  onOpenAccessibility,
  onOpenCommunity,
  onOpenDailyDigest
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'गृहपृष्ठ', path: '/' },
    { label: 'एक्सप्लेनर', path: '/explainers' },
    { label: 'पोस्टर स्टुडियो', path: '/poster-studio' },
    { label: 'ज्ञान क्विज', path: '/quiz' },
    { label: 'तथ्य जाँच गाइड', path: '/verify-information' },
    { label: 'सहकार्य', path: '/collaborate' }
  ];

  const facebookUrl = settings?.facebookUrl || 'https://facebook.com/khabargpt';
  const customLogoUrl = settings?.customLogoUrl || '/logo.png';
  const siteTitle = settings?.siteTitle || 'Khabar GPT';
  const bannerNotice =
    settings?.bannerNotice ||
    'सूचना: खबर GPT स्वतन्त्र सूचना पृष्ठ हो। यो दर्ता भएको समाचार संस्था वा प्रेस होइन।';
  const isBannerActive = settings?.bannerNoticeActive !== false;
  const isBreakingActive = Boolean(
    settings?.breakingNewsActive && settings?.breakingNewsText?.trim()
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs w-full">
      {/* 1. Official Safeguard Disclaimer Notice & Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-2.5 sm:px-4 border-b border-slate-800 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 w-full">
          {/* Left: Live Nepali Date & Time */}
          <div className="flex items-center justify-center gap-2 max-w-full text-center">
            <NepaliDateClock
              compact
              onOpenCalendar={onOpenNepaliCalendar}
            />
          </div>

          {/* Right: Quick Action Links (Daily Digest, Community, Accessibility) */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-2.5 gap-y-1 text-slate-300 text-[10px] sm:text-[11px] max-w-full">
            {onOpenDailyDigest && (
              <button
                onClick={onOpenDailyDigest}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold text-amber-300 shrink-0"
                title="आजको दैनिक न्यूजलेटर डाइजेस्ट"
              >
                <Mail className="w-3 h-3" />
                <span>दैनिक डाइजेस्ट</span>
              </button>
            )}

            <span className="text-slate-700 hidden xs:inline">|</span>

            {onOpenCommunity && (
              <button
                onClick={onOpenCommunity}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold text-emerald-400 shrink-0"
                title="WhatsApp & Viber च्यानलमा जोडिनुहोस्"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp / Viber</span>
              </button>
            )}

            <span className="text-slate-700 hidden xs:inline">|</span>

            {onOpenAccessibility && (
              <button
                onClick={onOpenAccessibility}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-slate-300 shrink-0"
                title="पहुँचयोग्यता सेटिङ (Alt+A)"
              >
                <Eye className="w-3 h-3 text-blue-400" />
                <span>पहुँचयोग्यता</span>
              </button>
            )}

            <span className="text-slate-700 hidden xs:inline">|</span>

            <button
              onClick={() => onNavigate('/settings')}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-slate-300 shrink-0"
              title="व्यक्तिगत सेटिङ"
            >
              <Settings className="w-3 h-3 text-slate-400" />
              <span>सेटिङ</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Live Breaking News Ticker (if enabled by admin) */}
      {isBreakingActive && (
        <div className="bg-red-600 text-white text-xs py-1.5 px-3 sm:px-4 overflow-hidden shadow-xs w-full">
          <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 w-full">
            <span className="inline-flex items-center gap-1 bg-white text-red-700 font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-sm shrink-0">
              <Zap className="w-3 h-3 fill-red-600" />
              ताजा अपडेट
            </span>
            <span className="truncate font-medium text-xs text-red-50 min-w-0">
              {settings?.breakingNewsText}
            </span>
          </div>
        </div>
      )}

      {/* 3. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6 w-full">
        {/* Zone 1: Dynamic Brand Logo & Wordmark */}
        <button
          onClick={() => {
            onNavigate('/');
            setMobileMenuOpen(false);
          }}
          className="flex items-center text-left hover:opacity-90 transition-opacity min-w-0 cursor-pointer"
          aria-label={`${siteTitle} Home`}
        >
          <KhabarLogo size="md" customUrl={customLogoUrl} title={siteTitle} />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(link.path);
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-red-600 font-semibold border-b-2 border-red-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action - Social Media Promotion & Channels */}
        <div className="flex items-center gap-2 shrink-0">
          {/* YouTube quick icon */}
          {settings?.youtubeUrl && (
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white items-center justify-center transition-colors"
              title="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          )}

          {/* TikTok quick icon */}
          {settings?.tiktokUrl && (
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex w-8 h-8 rounded-lg bg-slate-100 text-slate-800 hover:bg-black hover:text-white items-center justify-center transition-colors"
              title="TikTok"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.54c-.03 2.05-.8 4.11-2.28 5.57-1.57 1.56-3.79 2.37-6.03 2.19-2.08-.14-4.08-1.12-5.4-2.73-1.44-1.74-1.99-4.08-1.54-6.3.45-2.26 2.03-4.19 4.13-5.06 1.14-.48 2.39-.67 3.63-.58v4.14c-.69-.13-1.42-.09-2.08.15-.75.27-1.38.86-1.67 1.61-.31.78-.26 1.68.14 2.41.42.75 1.19 1.25 2.04 1.34 1.07.13 2.19-.34 2.79-1.22.45-.66.57-1.48.56-2.28V.02z"/>
              </svg>
            </a>
          )}

          {/* Accessibility Quick Toggle */}
          {onOpenAccessibility && (
            <button
              onClick={onOpenAccessibility}
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              title="पहुँचयोग्यता (Accessibility: Alt+A)"
              aria-label="पहुँचयोग्यता"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {/* Primary Facebook Page Button */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            title="Follow Khabar GPT on Facebook"
          >
            <span>फेसबुक</span>
            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </a>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-md animate-in fade-in">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                onNavigate(link.path);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-red-600 transition-colors flex items-center justify-between"
            >
              <span>{link.label}</span>
              {currentPath === link.path && (
                <span className="text-red-600 text-xs font-bold">सक्रिय</span>
              )}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            {onOpenDailyDigest && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDailyDigest();
                }}
                className="p-2 bg-amber-50 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>दैनिक डाइजेस्ट</span>
              </button>
            )}

            {onOpenCommunity && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommunity();
                }}
                className="p-2 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp / Viber</span>
              </button>
            )}

            {onOpenNepaliCalendar && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenNepaliCalendar();
                }}
                className="p-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 col-span-2"
              >
                <Calendar className="w-3.5 h-3.5 text-red-600" />
                <span>विक्रम संवत् क्यालेन्डर खोल्नुहोस्</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-3 py-2 text-sm text-blue-700 font-medium hover:bg-blue-50 rounded-lg flex items-center justify-between"
            >
              <span>फेसबुक पेज फलो गर्नुहोस्</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
