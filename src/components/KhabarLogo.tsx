import React from 'react';

interface KhabarLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  customUrl?: string;
  title?: string;
}

export const KhabarLogo: React.FC<KhabarLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  customUrl = '/logo.png',
  title = 'Khabar GPT'
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const [imgError, setImgError] = React.useState(false);

  // Render brand text dynamically based on configured title
  const renderBrandText = () => {
    const cleanTitle = (title || 'Khabar GPT').trim();
    // Check if it matches default pattern "Khabar GPT" or "खबर GPT"
    const lower = cleanTitle.toLowerCase();
    if (lower.startsWith('khabar') && lower.includes('gpt')) {
      const gptIndex = cleanTitle.toLowerCase().indexOf('gpt');
      const firstPart = cleanTitle.substring(0, gptIndex).trim();
      const secondPart = cleanTitle.substring(gptIndex);
      return (
        <div className={`flex items-baseline font-bold font-sans tracking-tight ${textSizes[size]}`}>
          <span className="text-red-600 font-extrabold">{firstPart}</span>
          <span className="text-slate-900 font-black tracking-normal ml-1">{secondPart}</span>
        </div>
      );
    } else if (cleanTitle.includes('खबर') && cleanTitle.includes('GPT')) {
      return (
        <div className={`flex items-baseline font-bold font-sans tracking-tight ${textSizes[size]}`}>
          <span className="text-red-600 font-extrabold">खबर</span>
          <span className="text-slate-900 font-black tracking-normal ml-1">GPT</span>
        </div>
      );
    } else {
      return (
        <div className={`font-bold font-sans tracking-tight text-slate-900 ${textSizes[size]}`}>
          {cleanTitle}
        </div>
      );
    }
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Circular Logo Emblem */}
      <div
        className={`${iconDimensions[size]} rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center shrink-0 overflow-hidden relative`}
        title={title || 'Khabar GPT Official Logo'}
      >
        {!imgError ? (
          <img
            src={customUrl || '/logo.png'}
            alt={title || 'Khabar GPT Emblem'}
            className="w-full h-full object-contain p-0.5"
            loading="eager"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg viewBox="0 0 100 100" className="w-full h-full p-1">
            <circle cx="50" cy="50" r="45" fill="#DC2626" />
            <path d="M50 20 L75 75 L50 62 L25 75 Z" fill="#FFFFFF" />
            <circle cx="50" cy="45" r="7" fill="#0EA5E9" />
          </svg>
        )}
      </div>

      {showText && renderBrandText()}
    </div>
  );
};
