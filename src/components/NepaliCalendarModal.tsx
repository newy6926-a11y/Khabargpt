import React, { useState } from 'react';
import {
  NEPALI_MONTHS,
  NEPALI_DAYS,
  NEPALI_HOLIDAYS,
  getNepaliDate,
  toNepaliDigits,
  getDaysInNepaliMonth,
  NepaliDateInfo
} from '../utils/nepaliCalendar';
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Compass,
  Sparkles,
  Clock,
  MapPin,
  Check
} from 'lucide-react';

interface NepaliCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NepaliCalendarModal: React.FC<NepaliCalendarModalProps> = ({
  isOpen,
  onClose
}) => {
  const today = getNepaliDate();
  const [currentYear, setCurrentYear] = useState(today.yearBs);
  const [currentMonth, setCurrentMonth] = useState(today.monthBs);

  if (!isOpen) return null;

  const monthObj = NEPALI_MONTHS[currentMonth - 1] || NEPALI_MONTHS[0];
  const totalDays = getDaysInNepaliMonth(currentYear, currentMonth);

  // Approximate starting day of the week for the selected month
  // Reference: 2081 Baisakh 1 = Saturday (day 6)
  const calculateFirstDayOfWeek = (year: number, month: number): number => {
    // 2081 Baisakh 1 was Saturday (index 6)
    let daysOffset = 6;
    if (year === 2081) {
      for (let m = 1; m < month; m++) {
        daysOffset = (daysOffset + getDaysInNepaliMonth(2081, m)) % 7;
      }
    } else if (year > 2081) {
      let total = 6;
      for (let y = 2081; y < year; y++) {
        for (let m = 1; m <= 12; m++) {
          total += getDaysInNepaliMonth(y, m);
        }
      }
      for (let m = 1; m < month; m++) {
        total += getDaysInNepaliMonth(year, m);
      }
      daysOffset = total % 7;
    } else {
      let total = 6;
      for (let y = year; y < 2081; y++) {
        for (let m = 1; m <= 12; m++) {
          total -= getDaysInNepaliMonth(y, m);
        }
      }
      for (let m = 1; m < month; m++) {
        total += getDaysInNepaliMonth(year, m);
      }
      daysOffset = ((total % 7) + 7) % 7;
    }
    return daysOffset;
  };

  const firstDayIndex = calculateFirstDayOfWeek(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleResetToday = () => {
    setCurrentYear(today.yearBs);
    setCurrentMonth(today.monthBs);
  };

  // Find holidays in current month
  const monthHolidays: { day: number; name: string }[] = [];
  for (let d = 1; d <= totalDays; d++) {
    const key = `${currentMonth}-${d}`;
    if (NEPALI_HOLIDAYS[key]) {
      monthHolidays.push({ day: d, name: NEPALI_HOLIDAYS[key] });
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-auto animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>विक्रम संवत् क्यालेन्डर (Bikram Sambat Calendar)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                नेपाल राष्ट्रिय विक्रम संवत् {toNepaliDigits(currentYear)} पञ्चाङ्ग तथा मिति
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="बन्द गर्नुहोस्"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Month Navigation & Today Jump */}
        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all cursor-pointer shadow-2xs"
            title="अघिल्लो महिना"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-base sm:text-lg font-extrabold text-slate-900 block leading-tight">
              {monthObj.np} {toNepaliDigits(currentYear)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {monthObj.en} {currentYear} BS
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetToday}
              className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              आज
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-xl transition-all cursor-pointer shadow-2xs"
              title="पछिल्लो महिना"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panchanga Snapshot for Today */}
        <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-red-200/80 rounded-2xl p-3.5 text-xs text-slate-700 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-red-800">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>आजको पञ्चाङ्ग (Today's Panchanga)</span>
            </span>
            <span className="font-mono text-slate-600">काठमाडौं, नेपाल (GMT+5:45)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="bg-white/80 p-2 rounded-xl border border-red-100">
              <span className="text-slate-400 block text-[10px]">तिथि (Tithi):</span>
              <span className="font-bold text-slate-800">{today.tithiNp}</span>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-red-100">
              <span className="text-slate-400 block text-[10px]">ऋतु (Season):</span>
              <span className="font-bold text-slate-800">{today.rituNp}</span>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-red-100">
              <span className="text-slate-400 block text-[10px]">सूर्योदय / सूर्यास्त:</span>
              <span className="font-bold text-slate-800 font-mono">०६:०८ / १८:१२</span>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-red-100">
              <span className="text-slate-400 block text-[10px]">नेपाल मानक समय:</span>
              <span className="font-bold text-emerald-700 font-mono">{today.nptTimeString}</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs">
            {NEPALI_DAYS.map((d, idx) => (
              <div
                key={d.en}
                className={`py-1.5 rounded-lg text-[11px] ${
                  idx === 6 ? 'text-red-600 bg-red-50/60 font-black' : 'text-slate-600'
                }`}
              >
                <span>{d.shortNp}</span>
                <span className="block text-[9px] font-normal text-slate-400 font-mono">
                  {d.shortEn}
                </span>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-10 sm:h-12 rounded-xl opacity-0" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayOfWeek = (firstDayIndex + idx) % 7;
              const isSaturday = dayOfWeek === 6;
              const isToday =
                currentYear === today.yearBs &&
                currentMonth === today.monthBs &&
                dayNum === today.dayBs;

              const holidayKey = `${currentMonth}-${dayNum}`;
              const holiday = NEPALI_HOLIDAYS[holidayKey];

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`h-11 sm:h-12 p-1 rounded-xl flex flex-col items-center justify-between transition-all border text-xs relative ${
                    isToday
                      ? 'bg-red-600 text-white font-extrabold border-red-600 shadow-md ring-2 ring-red-300'
                      : holiday
                      ? 'bg-amber-50 text-amber-900 border-amber-200 font-bold hover:bg-amber-100'
                      : isSaturday
                      ? 'bg-red-50/40 text-red-600 border-red-100 font-bold hover:bg-red-50'
                      : 'bg-white text-slate-800 border-slate-100 hover:bg-slate-50'
                  }`}
                  title={holiday ? `${dayNum}: ${holiday}` : `${dayNum} ${monthObj.np}`}
                >
                  <span className={`text-sm ${isToday ? 'text-white' : ''}`}>
                    {toNepaliDigits(dayNum)}
                  </span>

                  {isToday ? (
                    <span className="text-[9px] bg-white text-red-600 font-black px-1 rounded-xs">
                      आज
                    </span>
                  ) : holiday ? (
                    <span className="text-[8px] text-amber-700 truncate max-w-full px-0.5 leading-tight font-sans">
                      बिदा
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-mono">{dayNum}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Holidays List for this Month */}
        {monthHolidays.length > 0 && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>यस महिनाका मुख्य चाडपर्व तथा बिदाहरू ({monthHolidays.length}):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {monthHolidays.map((h) => (
                <div
                  key={h.day}
                  className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2 text-[11px]"
                >
                  <span className="bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0 font-mono">
                    {monthObj.np} {toNepaliDigits(h.day)}
                  </span>
                  <span className="text-slate-800 font-medium truncate">{h.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span>* नेपालमा प्रत्येक शनिबार सार्वजनिक बिदा हुन्छ।</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
