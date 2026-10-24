import React, { useState, useRef, useEffect } from 'react';
import { SiteSettings, MediaItem } from '../types';
import { api } from '../services/api';
import {
  BellRing,
  CheckCircle,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Eye,
  Save,
  Trash2,
  ExternalLink,
  Info,
  Sparkles,
  Link as LinkIcon,
  X,
  FolderOpen
} from 'lucide-react';

interface AdminNoticeManagerPanelProps {
  settings: SiteSettings;
  onSettingsUpdate: (settings: SiteSettings) => void;
  showNotification?: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminNoticeManagerPanel: React.FC<AdminNoticeManagerPanelProps> = ({
  settings,
  onSettingsUpdate,
  showNotification
}) => {
  const [active, setActive] = useState<boolean>(settings.entryPopupActive ?? true);
  const [showAlways, setShowAlways] = useState<boolean>(settings.entryPopupShowAlways ?? true);
  const [title, setTitle] = useState<string>(
    settings.entryPopupTitle || 'आधिकारिक सूचना (Official Notice)'
  );
  const [message, setMessage] = useState<string>(settings.entryPopupMessage || '');
  const [imageUrl, setImageUrl] = useState<string>(settings.entryPopupImageUrl || '/official-notice.svg');
  const [videoUrl, setVideoUrl] = useState<string>(settings.entryPopupVideoUrl || '');
  const [buttonText, setButtonText] = useState<string>(settings.entryPopupButtonText || 'फेसबुक पेजमा जोडिनुहोस्');
  const [buttonLink, setButtonLink] = useState<string>(settings.entryPopupButtonLink || 'https://facebook.com/khabargpt');
  const [contactPhone, setContactPhone] = useState<string>(settings.contactPhone || '');

  const [mediaType, setMediaType] = useState<'none' | 'photo' | 'video'>(
    videoUrl ? 'video' : imageUrl ? 'photo' : 'none'
  );

  const [uploading, setUploading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState<boolean>(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getMedia().then(setMediaList).catch(() => {});
  }, []);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    if (showNotification) {
      showNotification(msg, type);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('कृपया मान्य तस्बिर फाइल (JPG, PNG, WebP) छान्नुहोस्', 'error');
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploadMedia(file);
      setImageUrl(res.url);
      setVideoUrl('');
      setMediaType('photo');
      notify('तस्बिर सफलतापूर्वक अपलोड भयो!');
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'तस्बिर अपलोड असफल भयो', 'error');
    } finally {
      setUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      notify('कृपया मान्य भिडियो फाइल (MP4, WebM) छान्नुहोस्', 'error');
      return;
    }

    if (file.size > 40 * 1024 * 1024) {
      notify('भिडियो फाइल आकार ४० MB भन्दा कम हुनुपर्छ', 'error');
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploadMedia(file);
      setVideoUrl(res.url);
      setImageUrl('');
      setMediaType('video');
      notify('भिडियो सफलतापूर्वक अपलोड भयो!');
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'भिडियो अपलोड असफल भयो', 'error');
    } finally {
      setUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      const updatedSettingsPayload: Partial<SiteSettings> = {
        entryPopupActive: active,
        entryPopupShowAlways: showAlways,
        entryPopupTitle: title,
        entryPopupMessage: message,
        entryPopupImageUrl: mediaType === 'photo' ? imageUrl : '',
        entryPopupVideoUrl: mediaType === 'video' ? videoUrl : '',
        entryPopupButtonText: buttonText,
        entryPopupButtonLink: buttonLink,
        contactPhone: contactPhone.trim()
      };

      const updated = await api.updateSettings(updatedSettingsPayload);
      onSettingsUpdate(updated);
      notify('प्रारम्भिक सूचना सेटिङ सफलतापूर्वक सुरक्षित गरियो!');
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : 'सेटिङ सुरक्षित गर्न त्रुटि भयो', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/30 text-red-200 border border-red-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <BellRing className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>वेबसाइट खुल्दा देखिने प्रारम्भिक सूचना (Opening Welcome Notice)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
            वेबसाइट पहिलो पटक खुल्दा तुरुन्त देखिने पपअप सूचना व्यवस्थापन
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            यस खण्डबाट पाठकले खबर GPT वेबसाइट खोल्दा सर्वप्रथम देखिने जरुरी सूचना, विशेष घोषणा, चुनाव/बजेट अपडेट, फोटो वा भिडियो पपअप पूर्ण रूपमा नियन्त्रण गर्न सक्नुहुन्छ।
          </p>
        </div>

        {/* Status Indicator Pill */}
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border ${
              active
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-700/40 text-slate-400 border-slate-600/50'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{active ? 'सूचना हाल सक्रिय छ (Active on Website)' : 'सूचना हाल निष्क्रिय छ (Disabled)'}</span>
          </div>

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border border-white/20"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>लाइभ प्रिभ्यू हेर्नुहोस् (Live Preview)</span>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Toggle Switches Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>१. सक्रियता & देखाउने फ्रिक्वेन्सी (Activation & Frequency)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Toggle Active */}
            <div
              onClick={() => setActive(!active)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                active
                  ? 'border-red-500 bg-red-50/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => {}}
                className="mt-0.5 w-5 h-5 text-red-600 rounded cursor-pointer accent-red-600"
              />
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  सूचना सक्रिय गर्नुहोस् (Enable Notice Popup)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  यो अन गर्दा वेबसाइट खोल्ने जो कोहीलाई स्क्रिनको बीचमा यो पपअप देखा पर्नेछ।
                </p>
              </div>
            </div>

            {/* Toggle Show Always */}
            <div
              onClick={() => setShowAlways(!showAlways)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                showAlways
                  ? 'border-indigo-500 bg-indigo-50/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={showAlways}
                onChange={() => {}}
                className="mt-0.5 w-5 h-5 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  सधैं देखाउनुहोस् (Show Always on Every Visit)
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  यदि टिक लगाउनुभयो भने बन्द गरे पनि अर्को पटक वेबसाइट खोल्दा सधैं देखिन्छ (नत्र प्रति सेसन १ पटक मात्र)।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>२. सूचनाको शीर्षक & सन्देश विवरण (Notice Content)</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              सूचनाको मुख्य शीर्षक (Notice Title) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा: विशेष निर्वाचन नतिजा घोषणा वा महत्त्वपूर्ण जानकारी"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              विस्तृत सन्देश विवरण (Message Body / Description)
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="यहाँ पाठकलाई दिन चाहेको विस्तृत सूचना वा जानकारी टाइप गर्नुहोस्..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* Direct Photo & Video Media Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>३. सूचनामा प्रत्यक्ष फोटो वा भिडियो (Direct Photo or Video)</span>
            </h3>
            <span className="text-[11px] text-slate-500">लिङ्क मात्र होइन, कम्प्युटर/मोबाइलबाट सिधै अपलोड गर्न सकिन्छ</span>
          </div>

          {/* Media Type Selector */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setMediaType('none');
                setImageUrl('');
                setVideoUrl('');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mediaType === 'none'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              केवल पाठ (Text Only)
            </button>

            <button
              type="button"
              onClick={() => setMediaType('photo')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mediaType === 'photo'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>प्रत्यक्ष तस्बिर (Photo)</span>
            </button>

            <button
              type="button"
              onClick={() => setMediaType('video')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mediaType === 'video'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5 text-red-600" />
              <span>प्रत्यक्ष भिडियो (Video)</span>
            </button>
          </div>

          {/* Photo Controls */}
          {mediaType === 'photo' && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-800">
                    तस्बिर सिधै अपलोड गर्नुहोस् (कुनै बाह्य URL चाहिँदैन)
                  </label>
                  <span className="text-[11px] text-slate-500 block">
                    आफ्नो कम्प्युटर वा मोबाइलको ग्यालरीबाट सिधै फोटो छान्नुहोस्
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={photoInputRef}
                    accept="image/*"
                    onChange={async (e) => {
                      await handlePhotoUpload(e);
                      api.getMedia().then(setMediaList).catch(() => {});
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'अपलोड हुँदै...' : 'फोटो अपलोड (Upload)'}</span>
                  </button>

                  {mediaList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(!showMediaPicker)}
                      className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>ग्यालरीबाट छान्नुहोस्</span>
                    </button>
                  )}

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                      title="फोटो हटाउनुहोस्"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Media Picker Drawer */}
              {showMediaPicker && mediaList.length > 0 && (
                <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>ग्यालरीका तस्बिरहरू (क्लिक गरी छान्नुहोस्):</span>
                    <button
                      type="button"
                      onClick={() => setShowMediaPicker(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                    {mediaList.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setImageUrl(m.url);
                          setShowMediaPicker(false);
                          notify('ग्यालरीबाट तस्बिर छानियो!');
                        }}
                        className={`aspect-video rounded-lg overflow-hidden border-2 transition hover:scale-105 cursor-pointer ${
                          imageUrl === m.url ? 'border-red-600 ring-2 ring-red-400' : 'border-slate-200'
                        }`}
                      >
                        <img src={m.url} alt={m.originalName} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {imageUrl && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium truncate">
                      तस्बिर सुरक्षित: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px]">{imageUrl}</code>
                    </span>
                  </div>
                </div>
              )}

              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/uploads/... वा बाह्य तस्बिरको लिङ्क"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              {imageUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-96 bg-slate-900/5 p-2 flex items-center justify-center">
                  <img src={imageUrl} alt="Notice Preview" className="max-h-96 w-auto object-contain rounded-lg shadow-sm" />
                </div>
              )}
            </div>
          )}

          {/* Video Controls */}
          {mediaType === 'video' && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-700">
                  भिडियो (MP4, WebM) सिधै अपलोड गर्नुहोस् वा भिडियो/YouTube URL राख्नुहोस्
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/mp4,video/webm"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'अपलोड हुँदै...' : 'MP4 भिडियो अपलोड'}</span>
                  </button>

                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => setVideoUrl('')}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="भिडियो हटाउनुहोस्"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="वा भिडियो URL (YouTube लिङ्क वा प्रत्यक्ष https://...video.mp4)"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              {videoUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video max-h-56">
                  {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={
                        videoUrl.includes('embed')
                          ? videoUrl
                          : `https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop()}`
                      }
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={videoUrl} controls className="w-full h-full object-contain" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button & Redirection Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>४. कार्य बटन & गन्तव्य लिङ्क (Action Button & Link)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                बटनमा देखिने पाठ (Button Label)
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="उदा: विस्तृत हेर्नुहोस् वा दर्ता गर्नुहोस्"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                बटन क्लिक गर्दा खुल्ने लिङ्क (Target URL / Path)
              </label>
              <input
                type="text"
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                placeholder="उदा: /explainers वा https://facebook.com/..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Phone & Helpline Settings */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>५. आधिकारिक सम्पर्क फोन तथा हटलाइन (Notice Contact Phone)</span>
          </h3>

          <div className="max-w-md">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              सूचनाको सम्पर्क फोन नम्बर / हटलाइन
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="उदा: +977-9800000000 वा 01-4400000"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-red-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              यो फोन नम्बर होमपेज तथा सूचनाको सम्पर्क स्ट्रिपमा पाठकहरूलाई देखिनेछ।
            </p>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-300"
          >
            <Eye className="w-4 h-4" />
            <span>लाइभ पपअप प्रिभ्यू (Live Preview)</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-7 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'सुरक्षित गर्दै...' : 'सूचना सेटिङ तुरुन्त लागू गर्नुहोस्'}</span>
          </button>
        </div>
      </form>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-auto flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <BellRing className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 block">
                    महत्त्वपूर्ण जानकारी
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                    {title || 'सूचनाको शीर्षक'}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800 text-sm">
              {mediaType === 'video' && videoUrl && (
                <div className="rounded-2xl overflow-hidden bg-black border border-slate-200 aspect-video shadow-xs">
                  {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={
                        videoUrl.includes('embed')
                          ? videoUrl
                          : `https://www.youtube.com/embed/${videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop()}?autoplay=1&mute=1`
                      }
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={videoUrl} controls autoPlay muted playsInline loop className="w-full h-full object-contain" />
                  )}
                </div>
              )}

              {mediaType === 'photo' && imageUrl && (
                <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 max-h-72 shadow-xs">
                  <img src={imageUrl} alt="Notice Preview" className="w-full h-full object-cover object-center" />
                </div>
              )}

              {message && (
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {message}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-200/70 transition-colors cursor-pointer order-2 sm:order-1 text-center"
              >
                अहिले बन्द गर्नुहोस्
              </button>

              {buttonLink && (
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer order-1 sm:order-2"
                >
                  <span>{buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
