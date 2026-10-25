import React from 'react';
import { Home, Sparkles, HelpCircle, BookOpen, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath,
  onNavigate
}) => {
  const tabs = [
    { label: 'गृहपृष्ठ', path: '/', icon: Home },
    { label: 'पोस्टर स्टुडियो', path: '/poster-studio', icon: Sparkles },
    { label: 'क्विज', path: '/quiz', icon: HelpCircle },
    { label: 'एक्सप्लेनर', path: '/explainers', icon: BookOpen },
    { label: 'सेटिङ', path: '/settings', icon: Settings }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg w-full max-w-full">
      <nav className="grid grid-cols-5 items-center h-15 max-w-lg mx-auto w-full px-1">
        {tabs.map((tab) => {
          const isActive =
            tab.path === '/'
              ? currentPath === '/'
              : currentPath.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <button
              key={tab.path}
              onClick={() => onNavigate(tab.path)}
              className={`flex flex-col items-center justify-center h-full w-full py-1 transition-colors select-none cursor-pointer min-w-0 ${
                isActive ? 'text-red-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight truncate max-w-full text-center px-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
