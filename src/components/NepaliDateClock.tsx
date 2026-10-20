import React, { useState, useEffect } from 'react';
import { getNepaliDate, NepaliDateInfo } from '../utils/nepaliCalendar';
import { Calendar, Clock, ChevronDown, Sparkles } from 'lucide-react';

interface NepaliDateClockProps {
  onOpenCalendar?: () => void;
  compact?: boolean;
  className?: string;
}

export const NepaliDateClock: React.FC<NepaliDateClockProps> = ({
  onOpenCalendar,
  compact = false,
  className = ''
}) => {
  const [nepaliDate, setNepaliDate] = useState<NepaliDateInfo>(getNepaliDate());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setNepaliDate(getNepaliDate());
    }, 15000); // 15 sec update
    return () => clearInterval(timer);
  }, []);

  if (compact) {
    return (
      <button
        type="button"
        onClick={onOpenCalendar}
        className={`inline-flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer py-0.5 px-1.5 rounded-md hover:bg-slate-800/80 ${className}`}
        title="विक्रम संवत् क्यालेन्डर खोल्नुहोस्"
      >
        <Calendar className="w-3.5 h-3.5 text-red-400 shrink-0" />
        <span className="font-semibold text-slate-200">{nepaliDate.dateFormattedNp}</span>
        <span className="text-slate-500">·</span>
        <span className="font-mono text-slate-300">{nepaliDate.nptTimeString} NPT</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpenCalendar}
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl transition-all cursor-pointer border border-slate-200/60 shadow-2xs group ${className}`}
      title="विक्रम संवत् क्यालेन्डर खोल्नुहोस्"
    >
      <div className="flex items-center gap-1.5 text-red-600">
        <Calendar className="w-3.5 h-3.5" />
        <span className="text-xs font-bold text-slate-800 group-hover:text-red-700 transition-colors">
          {nepaliDate.dateFormattedNp}
        </span>
      </div>

      <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />

      <div className="hidden sm:flex items-center gap-1 text-slate-600 text-xs font-mono">
        <Clock className="w-3 h-3 text-slate-400" />
        <span>{nepaliDate.nptTimeString} NPT</span>
      </div>

      {nepaliDate.holidayName && (
        <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
          <Sparkles className="w-2.5 h-2.5" />
          <span>{nepaliDate.holidayName}</span>
        </span>
      )}

      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-y-0.5" />
    </button>
  );
};
