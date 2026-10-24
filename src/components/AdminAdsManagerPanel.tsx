import React, { useState, useEffect, useRef } from 'react';
import { AdItem, MediaItem } from '../types';
import { api } from '../services/api';
import {
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Eye,
  MousePointer,
  Percent,
  PlayCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Upload,
  ExternalLink,
  Sliders,
  Check,
  X,
  FolderOpen
} from 'lucide-react';

export const AdminAdsManagerPanel: React.FC = () => {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdItem | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'photo' as 'photo' | 'video' | 'link' | 'banner' | 'sponsored_card',
    targetUrl: '',
    imageUrl: '',
    videoUrl: '',
    mediaUrl: '',
    position: 'header_top' as 'header_top' | 'sidebar' | 'in_article' | 'footer' | 'popup_banner' | 'header',
    active: true,
    sponsorName: 'प्रायोजक (Sponsor)',
    description: '',
    disclaimerNotice: 'प्रायोजित सामग्री (Sponsored Ad)'
  });

  const loadAdsAndMedia = async () => {
    setLoading(true);
    try {
      const [adsData, mediaData] = await Promise.all([
        api.getAdminAds(),
        api.getMedia().catch(() => [])
      ]);
      setAds(adsData);
      setMediaList(mediaData);
    } catch {
      showNotice('विज्ञापन सूची लोड गर्न सकिएन', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdsAndMedia();
  }, []);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const openCreateModal = () => {
    setEditingAd(null);
    setFormData({
      title: '',
      type: 'photo',
      targetUrl: '',
      imageUrl: '',
      videoUrl: '',
      mediaUrl: '',
      position: 'header_top',
      active: true,
      sponsorName: 'प्रायोजक (Sponsor)',
      description: '',
      disclaimerNotice: 'प्रायोजित सामग्री (Sponsored Ad)'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ad: AdItem) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title || '',
      type: ad.type || 'photo',
      targetUrl: ad.targetUrl || '',
      imageUrl: ad.imageUrl || ad.mediaUrl || '',
      videoUrl: ad.videoUrl || ad.videoEmbedUrl || '',
      mediaUrl: ad.mediaUrl || ad.imageUrl || ad.videoUrl || '',
      position: (ad.position as any) || 'header_top',
      active: ad.active !== false,
      sponsorName: ad.sponsorName || ad.clientName || 'प्रायोजक (Sponsor)',
      description: ad.description || '',
      disclaimerNotice: ad.disclaimerNotice || 'प्रायोजित सामग्री (Sponsored Ad)'
    });
    setIsModalOpen(true);
  };

  // Handle Media File Upload (Direct photo or video)
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 40 * 1024 * 1024) {
      showNotice('फाइल आकार ४० MB भन्दा बढी हुन सक्दैन।', 'error');
      return;
    }

    setUploadingMedia(true);
    try {
      const res = await api.uploadMedia(file);
      if (formData.type === 'video' || file.type.startsWith('video/')) {
        setFormData((prev) => ({
          ...prev,
          videoUrl: res.url,
          mediaUrl: res.url,
          videoEmbedUrl: res.url,
          type: 'video'
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          imageUrl: res.url,
          mediaUrl: res.url,
          type: prev.type === 'video' ? 'photo' : prev.type
        }));
      }
      showNotice('मिडिया (फोटो/भिडियो) सफलतापूर्वक सिधै अपलोड भयो!');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'मिडिया अपलोड असफल भयो', 'error');
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetUrl) {
      showNotice('शीर्षक र गन्तव्य लिङ्क (Target URL) अनिवार्य छन्', 'error');
      return;
    }

    const payload = {
      ...formData,
      clientName: formData.sponsorName,
      mediaUrl: formData.type === 'video' ? (formData.videoUrl || formData.mediaUrl) : (formData.imageUrl || formData.mediaUrl),
      videoEmbedUrl: formData.videoUrl
    };

    try {
      if (editingAd) {
        // Edit existing ad
        const updated = await api.updateAd(editingAd.id, payload);
        setAds(ads.map((a) => (a.id === updated.id ? updated : a)));
        showNotice('विज्ञापन विवरण सफलतापूर्वक अद्यावधिक गरियो!');
      } else {
        // Create new ad
        const created = await api.createAd(payload);
        setAds([created, ...ads]);
        showNotice('नयाँ विज्ञापन सफलतापूर्वक थपियो!');
      }
      setIsModalOpen(false);
      setEditingAd(null);
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'विज्ञापन सुरक्षित गर्न असफल', 'error');
    }
  };

  const handleToggleActive = async (ad: AdItem) => {
    try {
      const updated = await api.updateAd(ad.id, { active: !ad.active });
      setAds(ads.map((a) => (a.id === updated.id ? updated : a)));
      showNotice(`विज्ञापन ${!ad.active ? 'सक्रिय' : 'निष्क्रिय'} बनाइयो`);
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'परिवर्तन असफल', 'error');
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm('के तपाईं निश्चित रूपमा यो विज्ञापन हटाउन चाहनुहुन्छ?')) return;
    try {
      await api.deleteAd(id);
      setAds(ads.filter((a) => a.id !== id));
      showNotice('विज्ञापन सफलतापूर्वक हटाइयो');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'हटाउन असफल', 'error');
    }
  };

  // Calculate totals
  const totalImpressions = ads.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const totalClicks = ads.reduce((acc, a) => acc + (a.clicks || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const estimatedRevenueNPR = Math.round((totalImpressions / 1000) * 80 + totalClicks * 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>विज्ञापन, इम्प्रेसन & आम्दानी व्यवस्थापन (Ad Manager & Revenue)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            विज्ञापन व्यवस्थापन (Ad Campaign Manager)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            फोटो ब्यानर, भिडियो विज्ञापन, वा स्पोन्सर्ड लिङ्क थप्नुहोस्, सम्पादन गर्नुहोस् वा मेटाउनुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAds}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="रिफ्रेस गर्नुहोस्"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ नयाँ विज्ञापन थप्नुहोस्</span>
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

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>कुल दृश्य (Impressions)</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalImpressions.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">पाठकहरूले विज्ञापन देखेको संख्या</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>कुल क्लिक (Clicks)</span>
            <MousePointer className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">लिङ्कमा क्लिक गरी भ्रमण गरेको</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>औसत CTR दर</span>
            <Percent className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {avgCtr}%
          </div>
          <p className="text-[11px] text-slate-400">Click-through Rate प्रतिशत</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-4 rounded-2xl border border-emerald-700/60 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>अनुमानित आम्दानी (Est. Revenue)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300 font-mono tabular-nums">
            रु {estimatedRevenueNPR.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 font-sans">नेपाली डिजिटल बजार दरअनुसार (CPM + CPC)</p>
        </div>
      </div>

      {/* Ads List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            सबै विज्ञापनहरूको सूची ({ads.length})
          </h3>
          <span className="text-xs text-slate-500">
            क्लिक वा भिडियो चलाउँदा प्रत्यक्ष डेटा अद्यावधिक हुन्छ
          </span>
        </div>

        {ads.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <DollarSign className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">हाल कुनै विज्ञापन थपिएको छैन। माथिको बटनबाट नयाँ विज्ञापन थप्नुहोस्।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5">विज्ञापन / प्रायोजक</th>
                  <th className="p-3.5">प्रकार</th>
                  <th className="p-3.5">स्थान (Placement)</th>
                  <th className="p-3.5 text-center">दृश्य (Impressions)</th>
                  <th className="p-3.5 text-center">क्लिक (Clicks)</th>
                  <th className="p-3.5 text-center">CTR</th>
                  <th className="p-3.5 text-center">अवस्था</th>
                  <th className="p-3.5 text-right">कार्यहरू (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {ads.map((ad) => {
                  const adCtr = (ad.impressions || 0) > 0 ? (((ad.clicks || 0) / ad.impressions) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={ad.id} className="hover:bg-slate-50/60">
                      <td className="p-3.5 font-medium text-slate-900 max-w-xs">
                        <div className="font-bold line-clamp-1">{ad.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {ad.sponsorName || ad.clientName} · {ad.targetUrl}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {ad.type === 'video' && <PlayCircle className="w-3 h-3 text-red-500" />}
                          {(ad.type === 'photo' || ad.type === 'banner') && <ImageIcon className="w-3 h-3 text-blue-500" />}
                          {ad.type === 'link' && <LinkIcon className="w-3 h-3 text-emerald-500" />}
                          <span>{ad.type?.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px]">
                        {ad.position}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-800">
                        {ad.impressions || 0}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-800">
                        {ad.clicks || 0}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-amber-600">
                        {adCtr}%
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleToggleActive(ad)}
                          className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            ad.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {ad.active ? 'सक्रिय' : 'निष्क्रिय'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(ad)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                            title="सम्पादन गर्नुहोस् (Edit Ad)"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="हटाउनुहोस् (Delete Ad)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add / Edit Ad */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>
                  {editingAd ? 'विज्ञापन सम्पादन गर्नुहोस् (Edit Ad)' : 'नयाँ विज्ञापन थप्नुहोस् (Add New Ad)'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  विज्ञापन शीर्षक / क्याम्पेन नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा: Nepal Airlines International Flights Promotion"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">विज्ञापनको प्रकार *</label>
                  <select
                    value={formData.type}
                    onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="photo">🖼️ तस्बिर ब्यानर (Photo Banner)</option>
                    <option value="video">🎥 भिडियो विज्ञापन (Video Ad)</option>
                    <option value="link">🔗 प्रायोजित लिङ्क (Link Card)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">स्थान (Placement) *</label>
                  <select
                    value={formData.position}
                    onChange={(e: any) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="header_top">Header Top (मुख्य पृष्ठको शीर्ष)</option>
                    <option value="in_article">In-Article (लेखको भित्र)</option>
                    <option value="sidebar">Sidebar (छेउको खण्ड)</option>
                    <option value="footer">Footer (तल्लो भाग)</option>
                    <option value="popup_banner">Floating Bottom / Popup Banner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  गन्तव्य URL (Target URL/Website Link) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/promotion"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              {/* Photo Banner Upload / URL */}
              {(formData.type === 'photo' || formData.type === 'banner') && (
                <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="font-bold text-slate-800 block text-xs">
                        ब्यानर तस्बिर (Banner Image)
                      </label>
                      <span className="text-[10px] text-slate-500">
                        कम्प्युटर वा मोबाइलबाट सिधै फोटो छान्नुहोस् (कुनै बाह्य URL चाहिँदैन)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={async (e) => {
                          await handleMediaUpload(e);
                          api.getMedia().then(setMediaList).catch(() => {});
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingMedia}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingMedia ? 'अपलोड हुँदै...' : 'फोटो अपलोड (Upload)'}</span>
                      </button>

                      {mediaList.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowMediaPicker(!showMediaPicker)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
                          <span>ग्यालरीबाट छान्नुहोस्</span>
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
                              setFormData({ ...formData, imageUrl: m.url, mediaUrl: m.url });
                              setShowMediaPicker(false);
                              showNotice('ग्यालरीबाट तस्बिर छानियो!');
                            }}
                            className={`aspect-video rounded-lg overflow-hidden border-2 transition hover:scale-105 cursor-pointer ${
                              formData.imageUrl === m.url ? 'border-red-600 ring-2 ring-red-400' : 'border-slate-200'
                            }`}
                          >
                            <img src={m.url} alt={m.originalName} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.imageUrl && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium truncate">
                          तस्बिर सक्रिय: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px]">{formData.imageUrl}</code>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '', mediaUrl: '' })}
                        className="text-red-600 hover:bg-red-50 p-1 rounded font-semibold text-xs shrink-0 cursor-pointer"
                      >
                        हटाउनुहोस्
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="/uploads/... वा बाह्य तस्बिरको लिङ्क"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value, mediaUrl: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                  />

                  {formData.imageUrl && (
                    <div className="relative aspect-[3/1] max-h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Video Ad Embed / URL */}
              {formData.type === 'video' && (
                <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="font-bold text-slate-800 block text-xs">
                        भिडियो सामग्री (Video Ad)
                      </label>
                      <span className="text-[10px] text-slate-500">
                        MP4 भिडियो सिधै अपलोड गर्नुहोस् वा YouTube लिङ्क टाँस्नुहोस्
                      </span>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleMediaUpload}
                      accept="video/mp4,video/webm"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingMedia}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingMedia ? 'अपलोड हुँदै...' : 'MP4 भिडियो अपलोड'}</span>
                    </button>
                  </div>

                  {formData.videoUrl && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium truncate">
                          भिडियो स्रोत: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono text-[11px]">{formData.videoUrl}</code>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, videoUrl: '', mediaUrl: '' })}
                        className="text-red-600 hover:bg-red-50 p-1 rounded font-semibold text-xs shrink-0 cursor-pointer"
                      >
                        हटाउनुहोस्
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="उदा: /uploads/... वा https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value, mediaUrl: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                  />

                  {formData.videoUrl && (
                    <div className="relative aspect-video max-h-36 rounded-xl overflow-hidden border border-slate-200 bg-black">
                      {formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={
                            formData.videoUrl.includes('embed')
                              ? formData.videoUrl
                              : `https://www.youtube.com/embed/${formData.videoUrl.split('v=')[1]?.split('&')[0] || formData.videoUrl.split('/').pop()}`
                          }
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={formData.videoUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Link Ad Thumbnail Upload */}
              {formData.type === 'link' && (
                <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <label className="font-bold text-slate-800 block text-xs">
                        लिङ्क थम्बनेल फोटो (वैकल्पिक)
                      </label>
                      <span className="text-[10px] text-slate-500">
                        कम्प्युटरबाट सिधै फोटो छान्नुहोस्
                      </span>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleMediaUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingMedia}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingMedia ? 'अपलोड हुँदै...' : 'फोटो छान्नुहोस्'}</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="/uploads/... वा तस्बिर लिङ्क"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value, mediaUrl: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                  />

                  {formData.imageUrl && (
                    <div className="relative aspect-[3/1] max-h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">प्रायोजक / ब्रान्डको नाम</label>
                  <input
                    type="text"
                    placeholder="उदा: Global IME Bank, Ncell, etc."
                    value={formData.sponsorName}
                    onChange={(e) => setFormData({ ...formData, sponsorName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">डिस्क्लेमर सूचना लेबल</label>
                  <input
                    type="text"
                    placeholder="प्रायोजित सामग्री (Sponsored Ad)"
                    value={formData.disclaimerNotice}
                    onChange={(e) => setFormData({ ...formData, disclaimerNotice: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">छोटो विवरण (वैकल्पिक)</label>
                <input
                  type="text"
                  placeholder="विज्ञापनको छोटो सारांश वा अफर विवरण..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <span className="font-semibold text-slate-700">तुरुन्त सक्रिय (Active) राख्नुहोस्</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    रद्द
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingAd ? 'अद्यावधिक गर्नुहोस्' : 'विज्ञापन सुरक्षित गर्नुहोस्'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
