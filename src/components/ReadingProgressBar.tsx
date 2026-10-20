import React, { useState, useEffect } from 'react';
import { toNepaliDigits } from '../utils/nepaliCalendar';
import { BookOpen, Clock } from 'lucide-react';

interface ReadingProgressBarProps {
  targetRef?: React.RefObject<HTMLElement | null>;
  estimatedTotalMinutes?: number;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  targetRef,
  estimatedTotalMinutes = 3
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let currentProgress = 0;

      if (targetRef?.current) {
        const el = targetRef.current;
        const rect = el.getBoundingClientRect();
        const totalHeight = el.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        if (totalHeight > 0) {
          currentProgress = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
        }
      } else {
        const docElem = document.documentElement;
        const docBody = document.body;
        const scrollTop = docElem.scrollTop || docBody.scrollTop;
        const scrollHeight = (docElem.scrollHeight || docBody.scrollHeight) - docElem.clientHeight;
        if (scrollHeight > 0) {
          currentProgress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        }
      }

      setProgress(Math.round(currentProgress));
      setIsVisible(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetRef]);

  if (!isVisible && progress === 0) return null;

  const remainingMinutes = Math.max(
    1,
    Math.round(estimatedTotalMinutes * (1 - progress / 100))
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Progress track line */}
      <div className="w-full h-1 bg-slate-200/60 backdrop-blur-xs">
        <div
          className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 transition-all duration-150 ease-out shadow-xs"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating mini readout pill */}
      {isVisible && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end pt-2">
          <div className="bg-slate-900/90 text-white text-[11px] font-semibold py-1 px-3 rounded-full backdrop-blur-md shadow-lg border border-slate-700/60 flex items-center gap-2 pointer-events-auto transition-opacity duration-200 animate-in fade-in">
            <div className="flex items-center gap-1 text-amber-400">
              <BookOpen className="w-3 h-3" />
              <span>{toNepaliDigits(progress)}% पढियो</span>
            </div>
            {progress < 95 && (
              <>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300 flex items-center gap-1 font-mono text-[10px]">
                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                  <span>बाँकी ~{toNepaliDigits(remainingMinutes)} मिनेट</span>
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
