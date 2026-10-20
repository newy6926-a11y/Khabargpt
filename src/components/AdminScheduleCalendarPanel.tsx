import React, { useState } from 'react';
import { ContentItem } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye
} from 'lucide-react';

interface AdminScheduleCalendarPanelProps {
  content: ContentItem[];
  onSelectArticle?: (item: ContentItem) => void;
}

export const AdminScheduleCalendarPanel: React.FC<AdminScheduleCalendarPanelProps> = ({
  content,
  onSelectArticle
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });

  // Filter content for calendar
  const filteredContent = content.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  // Group content by day in current month
  const itemsByDay: { [day: number]: ContentItem[] } = {};
  filteredContent.forEach((item) => {
    const itemDate = new Date(item.scheduledFor || item.createdAt);
    if (itemDate.getFullYear() === year && itemDate.getMonth() === month) {
      const day = itemDate.getDate();
      if (!itemsByDay[day]) itemsByDay[day] = [];
      itemsByDay[day].push(item);
    }
  });

  // Number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Scheduled vs Draft vs Published counts
  const publishedCount = content.filter((c) => c.status === 'published').length;
  const draftCount = content.filter((c) => c.status === 'draft').length;
  const scheduledCount = content.filter((c) => c.scheduledFor && new Date(c.scheduledFor) > new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>सम्पादकीय कार्यतालिका (Editorial Schedule & Calendar View)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            प्रकाशन क्यालेन्डर & समयतालिका
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            कुन मितिमा कुन समाचार वा व्याख्या प्रकाशित हुँदैछ, मस्यौदा (Drafts) र तालिकाबद्ध (Scheduled) सामग्री एकै नजरमा हेर्नुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e: any) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium"
          >
            <option value="all">सबै स्थिति (All)</option>
            <option value="published">प्रकाशित मात्र (Published)</option>
            <option value="draft">ड्राफ्ट मात्र (Draft)</option>
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">प्रकाशित सामग्री</span>
          <span className="text-2xl font-extrabold text-emerald-600 font-mono">{publishedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">मस्यौदा (Drafts)</span>
          <span className="text-2xl font-extrabold text-amber-600 font-mono">{draftCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">तालिकाबद्ध (Scheduled)</span>
          <span className="text-2xl font-extrabold text-blue-600 font-mono">{scheduledCount}</span>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Month Navigator Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="text-base font-bold text-slate-900">
              {monthName} {year}
            </h3>
            <span className="text-[11px] text-slate-500">
              यस महिनाका {Object.values(itemsByDay).reduce((a, b) => a + b.length, 0)} सामग्रीहरू
            </span>
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center font-bold text-[11px] text-slate-500 bg-slate-100/70 border-b border-slate-200 py-2">
          <span>आइत (Sun)</span>
          <span>सोम (Mon)</span>
          <span>मंगलबार (Tue)</span>
          <span>बुध (Wed)</span>
          <span>बिही (Thu)</span>
          <span>शुक्र (Fri)</span>
          <span>शनि (Sat)</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[420px]">
          {/* Empty cells before 1st of month */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-50/50 p-2 min-h-24"></div>
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayItems = itemsByDay[dayNum] || [];
            const isToday =
              new Date().getDate() === dayNum &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year;

            return (
              <div
                key={`day-${dayNum}`}
                className={`p-2 min-h-24 transition-colors ${
                  isToday ? 'bg-red-50/40' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded-full ${
                      isToday ? 'bg-red-600 text-white' : 'text-slate-700'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayItems.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dayItems.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectArticle && onSelectArticle(item)}
                      title={`${item.title} (${item.status})`}
                      className={`text-[10px] p-1 rounded font-medium truncate cursor-pointer transition-transform hover:scale-[1.02] ${
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-900 border-l-2 border-emerald-500'
                          : 'bg-amber-100 text-amber-900 border-l-2 border-amber-500'
                      }`}
                    >
                      {item.title}
                    </div>
                  ))}
                  {dayItems.length > 3 && (
                    <span className="text-[9px] text-slate-400 block text-center">
                      +{dayItems.length - 3} थप
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
