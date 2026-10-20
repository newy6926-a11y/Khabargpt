import React from 'react';
import { Home, AlertTriangle, ArrowLeft, Mail } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest">
          त्रुटि ४०४ (Error 404)
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-900">
          पृष्ठ फेला परेन (Page Not Found)
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          तपाईंले खोज्नुभएको पृष्ठ हटाइएको, स्थान परिवर्तन गरिएको वा लिङ्कमा प्राविधिक त्रुटि भएको हुन सक्छ।
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>गृहपृष्ठमा फर्कनुहोस्</span>
        </button>

        <button
          onClick={() => onNavigate('/contact')}
          className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span>बिग्रिएको लिङ्क रिपोर्ट गर्नुहोस्</span>
        </button>
      </div>
    </div>
  );
};
