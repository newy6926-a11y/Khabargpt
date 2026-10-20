import React, { useState, useEffect } from 'react';
import { LiveEvent, LiveUpdate } from '../types';
import { api } from '../services/api';
import {
  Radio,
  Plus,
  Trash2,
  Edit3,
  Pin,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Zap,
  RefreshCw,
  Eye,
  Calendar
} from 'lucide-react';

export const AdminLiveEventsPanel: React.FC = () => {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Event Form State
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    slug: '',
    summary: '',
    status: 'live' as 'live' | 'ended' | 'scheduled',
    coverImage: ''
  });

  // New Update Form State
  const [newUpdate, setNewUpdate] = useState({
    time: new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' }),
    author: 'Khabar GPT सम्पादक',
    content: '',
    isBreaking: false,
    isPinned: false
  });

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getLiveEvents(true);
      setEvents(data);
      if (data.length > 0 && !selectedEventId) {
        setSelectedEventId(data[0].id);
      }
    } catch {
      showNotice('लाइभ इभेन्ट लोड गर्न असफल', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.slug) {
      showNotice('शीर्षक र स्लग अनिवार्य छन्', 'error');
      return;
    }
    try {
      const created = await api.createLiveEvent({
        ...newEvent,
        eventDate: new Date().toISOString(),
        updates: []
      });
      setEvents([created, ...events]);
      setSelectedEventId(created.id);
      setIsCreatingEvent(false);
      setNewEvent({ title: '', slug: '', summary: '', status: 'live', coverImage: '' });
      showNotice('नयाँ प्रत्यक्ष कभरेज सिर्जना भयो!');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'सिर्जना असफल', 'error');
    }
  };

  const handleToggleStatus = async (event: LiveEvent) => {
    const nextStatus = event.status === 'live' ? 'ended' : 'live';
    try {
      const updated = await api.updateLiveEvent(event.id, { status: nextStatus });
      setEvents(events.map((e) => (e.id === updated.id ? updated : e)));
      showNotice(`इभेन्ट स्थिति परिवर्तन गरियो: ${nextStatus === 'live' ? 'प्रत्यक्ष (LIVE)' : 'सम्पन्न (Ended)'}`);
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'परिवर्तन असफल', 'error');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('के तपाईं निश्चित रूपमा यो प्रत्यक्ष कभरेज हटाउन चाहनुहुन्छ?')) return;
    try {
      await api.deleteLiveEvent(id);
      setEvents(events.filter((e) => e.id !== id));
      if (selectedEventId === id) {
        const remaining = events.filter((e) => e.id !== id);
        setSelectedEventId(remaining[0]?.id || null);
      }
      showNotice('प्रत्यक्ष कभरेज हटाइयो');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'हटाउन असफल', 'error');
    }
  };

  const handleAddLiveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !newUpdate.content) {
      showNotice('अपडेटको सामग्री भर्नुहोस्', 'error');
      return;
    }
    try {
      await api.addLiveUpdate(selectedEventId, newUpdate);
      await loadEvents();
      setNewUpdate({
        time: new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' }),
        author: 'Khabar GPT सम्पादक',
        content: '',
        isBreaking: false,
        isPinned: false
      });
      showNotice('ताजा लाइभ अपडेट प्रकाशित भयो!');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'अपडेट थप्न असफल', 'error');
    }
  };

  const handleDeleteUpdate = async (updateId: string) => {
    if (!selectedEventId) return;
    if (!window.confirm('यो लाइभ अपडेट हटाउने?')) return;
    try {
      await api.deleteLiveUpdate(selectedEventId, updateId);
      await loadEvents();
      showNotice('अपडेट हटाइयो');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'हटाउन असफल', 'error');
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>प्रत्यक्ष कभरेज प्रणाली (Live Event Coverage)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            प्रत्यक्ष समाचार, घटना र मतगणना व्यवस्थापन
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            चुनाव, बजेट, प्राकृतिक विपद् वा विशेष घटनाको रियल-टाइम लाइभ ब्लगिङ व्यवस्थापन गर्नुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadEvents}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="रिफ्रेस गर्नुहोस्"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsCreatingEvent(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>नयाँ लाइभ इभेन्ट थप्नुहोस्</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Modal: Create Live Event */}
      {isCreatingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-600" />
              <span>नयाँ प्रत्यक्ष कभरेज सिर्जना गर्नुहोस्</span>
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  इभेन्ट शीर्षक (नेपालीमा) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा: संघीय संसद् निर्वाचन २०८४ - मतगणना तथा प्रत्यक्ष अपडेट"
                  value={newEvent.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
                      .replace(/^-|-$/g, '') || 'live-event';
                    setNewEvent({ ...newEvent, title, slug: newEvent.slug || slug });
                  }}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  URL स्लग (अङ्ग्रेजी/Devanagari) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="chunab-2084-live"
                  value={newEvent.slug}
                  onChange={(e) => setNewEvent({ ...newEvent, slug: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  संक्षिप्त विवरण (Summary)
                </label>
                <textarea
                  rows={2}
                  placeholder="यस कभरेजको मुख्य उद्देश्य र पृष्ठभूमि..."
                  value={newEvent.summary}
                  onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    अवस्था (Status)
                  </label>
                  <select
                    value={newEvent.status}
                    onChange={(e: any) => setNewEvent({ ...newEvent, status: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="live">🔴 प्रत्यक्ष (Live)</option>
                    <option value="scheduled">🕒 निर्धारित (Scheduled)</option>
                    <option value="ended">सम्पन्न (Ended)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    कभर तस्बिर URL (ऐच्छिक)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newEvent.coverImage}
                    onChange={(e) => setNewEvent({ ...newEvent, coverImage: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingEvent(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  सिर्जना गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid: Left Event Selector, Right Updates Stream Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Events List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            प्रत्यक्ष कभरेज सूची ({events.length})
          </h3>

          {events.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <Radio className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">हाल कुनै लाइभ इभेन्ट छैन।</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedEventId === ev.id
                      ? 'bg-red-50/60 border-red-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        ev.status === 'live'
                          ? 'bg-red-600 text-white animate-pulse'
                          : ev.status === 'scheduled'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {ev.status === 'live' ? '🔴 LIVE' : ev.status === 'scheduled' ? 'निर्धारित' : 'सम्पन्न'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {ev.updates?.length || 0} अपडेटहरू
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                    {ev.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                    {ev.summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(ev);
                      }}
                      className="text-slate-600 hover:text-slate-900 font-medium underline"
                    >
                      {ev.status === 'live' ? 'इभेन्ट अन्त्य गर्नुहोस्' : 'पुन: प्रत्यक्ष (Live) बनाउनुहोस्'}
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/live/${ev.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="सार्वजनिक पृष्ठ हेर्नुहोस्"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(ev.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="इभेन्ट मेटाउनुहोस्"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Selected Event Updates & Post Live Update */}
        <div className="lg:col-span-7 space-y-4">
          {selectedEvent ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-600">सक्रिय कभरेज:</span>
                    <h3 className="text-base font-bold text-slate-900">{selectedEvent.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    /live/{selectedEvent.slug} · कुल {selectedEvent.updates?.length || 0} लाइभ अपडेटहरू
                  </p>
                </div>

                <a
                  href={`/live/${selectedEvent.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <span>लाइभ पृष्ठ हेर्नुहोस्</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Publish Live Update Form */}
              <form onSubmit={handleAddLiveUpdate} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>नयाँ लाइभ अपडेट पोस्ट गर्नुहोस्</span>
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-red-600 font-medium">
                      <input
                        type="checkbox"
                        checked={newUpdate.isBreaking}
                        onChange={(e) => setNewUpdate({ ...newUpdate, isBreaking: e.target.checked })}
                        className="accent-red-600 rounded"
                      />
                      <span>ब्रेकिङ (Breaking)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-amber-700 font-medium">
                      <input
                        type="checkbox"
                        checked={newUpdate.isPinned}
                        onChange={(e) => setNewUpdate({ ...newUpdate, isPinned: e.target.checked })}
                        className="accent-amber-600 rounded"
                      />
                      <span>पिन गर्नुहोस् (Pin Highlight)</span>
                    </label>
                  </div>
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder="यहाँ ताजा घटना वा मतगणनाको विवरण लेख्नुहोस्... (उदा: काठमाडौँ क्षेत्र नं १ मा पहिलो चरणको मतगणना सुरु भएको छ।)"
                  value={newUpdate.content}
                  onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                  className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500"
                />

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono">समय:</span>
                    <input
                      type="text"
                      value={newUpdate.time}
                      onChange={(e) => setNewUpdate({ ...newUpdate, time: e.target.value })}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs w-24 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="लेखक/स्रोत"
                      value={newUpdate.author}
                      onChange={(e) => setNewUpdate({ ...newUpdate, author: e.target.value })}
                      className="px-2 py-1 bg-white border border-slate-300 rounded text-xs w-36"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>अपडेट प्रकाशित गर्नुहोस्</span>
                  </button>
                </div>
              </form>

              {/* Updates Timeline List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  हालका अपडेटहरू (टाइमलाइन)
                </h4>

                {(!selectedEvent.updates || selectedEvent.updates.length === 0) ? (
                  <p className="text-xs text-slate-400 py-6 text-center">
                    कुनै अपडेट हालसम्म पोस्ट गरिएको छैन। माथिको फारामबाट पहिलो अपडेट थप्नुहोस्।
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {selectedEvent.updates.map((up) => (
                      <div
                        key={up.id}
                        className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                          up.isBreaking
                            ? 'bg-red-50/70 border-red-300'
                            : up.isPinned
                            ? 'bg-amber-50/70 border-amber-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-red-600 bg-red-100/80 px-1.5 py-0.5 rounded text-[10px]">
                              {up.time || up.timeLabel || (up.timestamp ? new Date(up.timestamp).toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' }) : '')}
                            </span>
                            {up.isBreaking && (
                              <span className="bg-red-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase">
                                ब्रेकिङ
                              </span>
                            )}
                            {up.isPinned && (
                              <span className="bg-amber-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Pin className="w-2.5 h-2.5" /> पिन
                              </span>
                            )}
                            <span className="text-slate-400 text-[11px]">({up.author})</span>
                          </div>
                          <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                            {up.content}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteUpdate(up.id)}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                          title="अपडेट हटाउनुहोस्"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500">बायाँबाट कुनै इभेन्ट चयन गर्नुहोस् वा नयाँ सिर्जना गर्नुहोस्।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
