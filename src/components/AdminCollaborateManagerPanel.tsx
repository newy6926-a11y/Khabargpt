import React, { useState, useEffect } from 'react';
import {
  Facebook,
  Globe,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  Image as ImageIcon,
  Calendar,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Info,
  DollarSign,
  Tag
} from 'lucide-react';
import {
  SiteSettings,
  CollaboratePageConfig,
  PromotionServiceItem,
  VerifiedMetricItem,
  AnalyticsScreenshotItem
} from '../types';
import { api } from '../services/api';

interface AdminCollaborateManagerPanelProps {
  settings?: SiteSettings;
  onSettingsUpdate?: (newSettings: SiteSettings) => void;
}

export const AdminCollaborateManagerPanel: React.FC<AdminCollaborateManagerPanelProps> = ({
  settings: initialSettings,
  onSettingsUpdate
}) => {
  const [config, setConfig] = useState<CollaboratePageConfig>({
    fbServices: [],
    webServices: [],
    verifiedMetrics: [],
    analyticsScreenshots: [],
    editorialDisclaimer: '',
    notRegisteredPressNotice: '',
    webTrafficDisclaimer: ''
  });
  const [activePlatformTab, setActivePlatformTab] = useState<'facebook' | 'website' | 'metrics' | 'screenshots' | 'disclaimers'>('facebook');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Screenshot form modal/fields
  const [newScreenshot, setNewScreenshot] = useState<Partial<AnalyticsScreenshotItem>>({
    title: '',
    imageUrl: '',
    metricShown: '',
    reportingPeriod: '',
    source: 'Meta Business Suite Insights',
    notes: '',
    isConfirmedByOwner: true
  });
  const [showAddScreenshot, setShowAddScreenshot] = useState(false);

  useEffect(() => {
    if (initialSettings?.collaborateConfig) {
      setConfig(initialSettings.collaborateConfig);
    } else {
      api.getSettings().then((res: SiteSettings) => {
        if (res?.collaborateConfig) {
          setConfig(res.collaborateConfig);
        }
      }).catch(err => {
        console.error('Failed to load collaborate config', err);
      });
    }
  }, [initialSettings]);

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const current = initialSettings || (await api.getSettings());
      if (!current) throw new Error('Settings could not be loaded');

      const updatedSettings: SiteSettings = {
        ...current,
        collaborateConfig: config
      };

      const result = await api.updateSettings(updatedSettings);
      setStatusMessage({
        type: 'success',
        text: 'प्रवर्द्धन तथा सहकार्य सेटिङ सफलतापूर्वक सुरक्षित भयो (Collaborate settings saved successfully)!'
      });
      if (onSettingsUpdate) {
        onSettingsUpdate(result || updatedSettings);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'सर्भर त्रुटि: सुरक्षित गर्न सकिएन।'
      });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Service updates
  const updateFbService = (id: string, updates: Partial<PromotionServiceItem>) => {
    setConfig((prev: CollaboratePageConfig) => ({
      ...prev,
      fbServices: (prev.fbServices || []).map((s: PromotionServiceItem) => (s.id === id ? { ...s, ...updates } : s))
    }));
  };

  const updateWebService = (id: string, updates: Partial<PromotionServiceItem>) => {
    setConfig((prev: CollaboratePageConfig) => ({
      ...prev,
      webServices: (prev.webServices || []).map((s: PromotionServiceItem) => (s.id === id ? { ...s, ...updates } : s))
    }));
  };

  // Metric updates
  const updateMetric = (id: string, updates: Partial<VerifiedMetricItem>) => {
    setConfig((prev: CollaboratePageConfig) => ({
      ...prev,
      verifiedMetrics: (prev.verifiedMetrics || []).map((m: VerifiedMetricItem) => (m.id === id ? { ...m, ...updates } : m))
    }));
  };

  // Screenshot actions
  const handleAddScreenshot = () => {
    if (!newScreenshot.imageUrl || !newScreenshot.title) {
      alert('कृपया शीर्षक र तस्बिर URL भर्नुहोस्।');
      return;
    }
    const item: AnalyticsScreenshotItem = {
      id: 'ss-' + Date.now(),
      title: newScreenshot.title || 'Analytics Screenshot',
      imageUrl: newScreenshot.imageUrl,
      metricShown: newScreenshot.metricShown || 'Meta Insights',
      reportingPeriod: newScreenshot.reportingPeriod || 'पछिल्लो २८ दिन',
      source: newScreenshot.source || 'Meta Business Suite Insights',
      notes: newScreenshot.notes || '',
      isConfirmedByOwner: newScreenshot.isConfirmedByOwner ?? true
    };
    setConfig((prev: CollaboratePageConfig) => ({
      ...prev,
      analyticsScreenshots: [item, ...(prev.analyticsScreenshots || [])]
    }));
    setNewScreenshot({
      title: '',
      imageUrl: '',
      metricShown: '',
      reportingPeriod: '',
      source: 'Meta Business Suite Insights',
      notes: '',
      isConfirmedByOwner: true
    });
    setShowAddScreenshot(false);
  };

  const deleteScreenshot = (id: string) => {
    if (window.confirm('के तपाईं यो स्क्रिनसट हटाउन चाहनुहुन्छ?')) {
      setConfig((prev: CollaboratePageConfig) => ({
        ...prev,
        analyticsScreenshots: (prev.analyticsScreenshots || []).filter((s: AnalyticsScreenshotItem) => s.id !== id)
      }));
    }
  };

  const fbServices = config.fbServices || [];
  const webServices = config.webServices || [];
  const verifiedMetrics = config.verifiedMetrics || [];
  const analyticsScreenshots = config.analyticsScreenshots || [];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-6">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
              <Facebook className="w-5 h-5" />
            </span>
            <span>सहकार्य तथा प्रवर्द्धन व्यवस्थापक (Collaborate & Promotion Manager)</span>
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
            वेबसाइटको <strong>/collaborate</strong> पृष्ठमा देखिने फेसबुक र वेबसाइटका सेवाहरू, मूल्यहरू (Pricing), वास्तविक एनालिटिक्स तथ्याङ्क र स्क्रिनसटहरू सम्पादन गर्नुहोस्।
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs disabled:opacity-50 transition text-sm shrink-0 cursor-pointer"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'सुरक्षित हुँदै...' : 'सबै परिवर्तन सुरक्षित गर्नुहोस्'}</span>
        </button>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActivePlatformTab('facebook')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
            activePlatformTab === 'facebook'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Facebook className="w-4 h-4" />
          <span>फेसबुक सेवाहरू ({fbServices.length})</span>
        </button>

        <button
          onClick={() => setActivePlatformTab('website')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
            activePlatformTab === 'website'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>वेबसाइट सेवाहरू ({webServices.length})</span>
        </button>

        <button
          onClick={() => setActivePlatformTab('metrics')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
            activePlatformTab === 'metrics'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>प्रमाणित तथ्याङ्क ({verifiedMetrics.length})</span>
        </button>

        <button
          onClick={() => setActivePlatformTab('screenshots')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
            activePlatformTab === 'screenshots'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>एनालिटिक्स ग्यालरी ({analyticsScreenshots.length})</span>
        </button>

        <button
          onClick={() => setActivePlatformTab('disclaimers')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
            activePlatformTab === 'disclaimers'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>विश्वास तथा मापदण्ड</span>
        </button>
      </div>

      {/* TAB 1: FACEBOOK SERVICES */}
      {activePlatformTab === 'facebook' && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>
              फेसबुक पेज हाम्रा लागि <strong>मुख्य प्रवर्द्धन च्यानल (Primary Channel)</strong> हो। मूल्य खाली छाडेमा वा 'Request a Quote' चयन गरेमा सार्वजनिक पृष्ठमा <em>"Request a Quote"</em> देखिनेछ।
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {fbServices.map((service: PromotionServiceItem, idx: number) => (
              <div
                key={service.id}
                className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {service.titleNp}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300">({service.title})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={service.isAvailable}
                        onChange={e => updateFbService(service.id, { isAvailable: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{service.isAvailable ? 'उपलब्ध (Available)' : 'बन्द (Unavailable)'}</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      फर्म्याट (Format)
                    </label>
                    <input
                      type="text"
                      value={service.format}
                      onChange={e => updateFbService(service.id, { format: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      डेलिभरेबल्स (Deliverables)
                    </label>
                    <input
                      type="text"
                      value={service.deliverables}
                      onChange={e => updateFbService(service.id, { deliverables: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      प्रस्तावित अवधि (Duration)
                    </label>
                    <input
                      type="text"
                      value={service.duration}
                      onChange={e => updateFbService(service.id, { duration: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      मूल्य प्रकार (Price Type)
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={service.priceType}
                        onChange={e => updateFbService(service.id, { priceType: e.target.value as 'fixed' | 'quote' })}
                        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      >
                        <option value="quote">Request a Quote</option>
                        <option value="fixed">निश्चित मूल्य (Fixed NPR)</option>
                      </select>
                      {service.priceType === 'fixed' && (
                        <input
                          type="number"
                          placeholder="रु. NPR"
                          value={service.priceNpr || ''}
                          onChange={e => updateFbService(service.id, { priceNpr: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                    कैफियत / टिप्पणी (Notes / Description)
                  </label>
                  <input
                    type="text"
                    value={service.notes || ''}
                    onChange={e => updateFbService(service.id, { notes: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    placeholder="e.g. फेसबुक पेजमा स्थायी पोस्ट रहनेछ..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WEBSITE SERVICES */}
      {activePlatformTab === 'website' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              वेबसाइट प्रवर्द्धन <strong>सहायक (Secondary)</strong> सेवा हो। यहाँ केवल कार्यान्वयन भएका वास्तविक ब्यानर तथा प्रायोजित सूचनाहरू मात्र राखिएका छन्।
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {webServices.map((service: PromotionServiceItem, idx: number) => (
              <div
                key={service.id}
                className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {service.titleNp}
                    </span>
                    <span className="text-xs text-slate-700 dark:text-slate-300">({service.title})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={service.isAvailable}
                        onChange={e => updateWebService(service.id, { isAvailable: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <span>{service.isAvailable ? 'उपलब्ध (Available)' : 'बन्द (Unavailable)'}</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      फर्म्याट (Format)
                    </label>
                    <input
                      type="text"
                      value={service.format}
                      onChange={e => updateWebService(service.id, { format: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      डेलिभरेबल्स (Deliverables)
                    </label>
                    <input
                      type="text"
                      value={service.deliverables}
                      onChange={e => updateWebService(service.id, { deliverables: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      प्रस्तावित अवधि (Duration)
                    </label>
                    <input
                      type="text"
                      value={service.duration}
                      onChange={e => updateWebService(service.id, { duration: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      मूल्य प्रकार (Price Type)
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={service.priceType}
                        onChange={e => updateWebService(service.id, { priceType: e.target.value as 'fixed' | 'quote' })}
                        className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                      >
                        <option value="quote">Request a Quote</option>
                        <option value="fixed">निश्चित मूल्य (Fixed NPR)</option>
                      </select>
                      {service.priceType === 'fixed' && (
                        <input
                          type="number"
                          placeholder="रु. NPR"
                          value={service.priceNpr || ''}
                          onChange={e => updateWebService(service.id, { priceNpr: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                    कैफियत / विवरण (Notes)
                  </label>
                  <input
                    type="text"
                    value={service.notes || ''}
                    onChange={e => updateWebService(service.id, { notes: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    placeholder="e.g. होमपेज तथा लेख विवरण पृष्ठमा..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VERIFIED METRICS */}
      {activePlatformTab === 'metrics' && (
        <div className="space-y-4">
          <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>सत्य तथ्याङ्क नियम (Authentic Metrics Only):</strong> प्रत्येक तथ्याङ्कको मेट्रिक नाम, मिति सीमा (Date Range), स्रोत (Source) र प्रमाणीकरण हुनु अनिवार्य छ। यदि कुनै मेट्रिक प्रमाणित वा हाल उपलब्ध छैन भने 'प्रमाणित छ (Verified)' अनचेक गर्नुहोस्—वेबसाइटमा स्वचालित रूपमा <em>"Updated analytics coming soon"</em> देखिनेछ।
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiedMetrics.map((metric: VerifiedMetricItem) => (
              <div
                key={metric.id}
                className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {metric.metricNameNp || metric.metricName}
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={metric.isVerified}
                      onChange={e => updateMetric(metric.id, { isVerified: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className={metric.isVerified ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-amber-700 dark:text-amber-400'}>
                      {metric.isVerified ? 'प्रमाणित (Verified)' : 'Coming Soon'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      मान / संख्या (Value)
                    </label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={e => updateMetric(metric.id, { value: e.target.value })}
                      placeholder="e.g. ४५,०००+"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      समय सीमा (Date Range)
                    </label>
                    <input
                      type="text"
                      value={metric.dateRange}
                      onChange={e => updateMetric(metric.id, { dateRange: e.target.value })}
                      placeholder="e.g. पछिल्लो २८ दिन"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      स्रोत (Source)
                    </label>
                    <input
                      type="text"
                      value={metric.source}
                      onChange={e => updateMetric(metric.id, { source: e.target.value })}
                      placeholder="e.g. Meta Business Suite"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      अपडेट मिति (Last Updated)
                    </label>
                    <input
                      type="text"
                      value={metric.lastUpdatedDate}
                      onChange={e => updateMetric(metric.id, { lastUpdatedDate: e.target.value })}
                      placeholder="YYYY-MM-DD"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1 text-xs">
                    कैफियत / विवरण (Notes)
                  </label>
                  <input
                    type="text"
                    value={metric.notes || ''}
                    onChange={e => updateMetric(metric.id, { notes: e.target.value })}
                    placeholder="e.g. Meta Business Suite Insights बाट लिइएको वास्तविक तथ्याङ्क"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS SCREENSHOTS */}
      {activePlatformTab === 'screenshots' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                वास्तविक मेटा बिजनेस सुइट स्क्रिनसटहरू (Genuine Analytics Screenshots)
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                साइट मालिकले उपलब्ध गराएका वास्तविक स्क्रिनसटहरू मात्र अपलोड वा लिङ्क गर्नुहोस्।
              </p>
            </div>

            <button
              onClick={() => setShowAddScreenshot(!showAddScreenshot)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>नयाँ स्क्रिनसट थप्नुहोस्</span>
            </button>
          </div>

          {/* Add screenshot box */}
          {showAddScreenshot && (
            <div className="bg-blue-50/60 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-3 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">
                नयाँ स्क्रिनसट विवरण प्रविष्टि
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    शीर्षक / क्याप्सन *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. फेसबुक पेज २८-दिने पहुँच (Reach Breakdown)"
                    value={newScreenshot.title}
                    onChange={e => setNewScreenshot({ ...newScreenshot, title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    तस्बिरको URL (Image URL) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /assets/aistudio/... वा https://..."
                    value={newScreenshot.imageUrl}
                    onChange={e => setNewScreenshot({ ...newScreenshot, imageUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    देखाइएको मेट्रिक (Metric Shown)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Reach & Video Plays"
                    value={newScreenshot.metricShown}
                    onChange={e => setNewScreenshot({ ...newScreenshot, metricShown: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    अवधि (Reporting Period)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. पछिल्लो २८ दिन (Last 28 Days)"
                    value={newScreenshot.reportingPeriod}
                    onChange={e => setNewScreenshot({ ...newScreenshot, reportingPeriod: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddScreenshot(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  onClick={handleAddScreenshot}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition"
                >
                  ग्यालरीमा थप्नुहोस्
                </button>
              </div>
            </div>
          )}

          {analyticsScreenshots.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <ImageIcon className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                हाल कुनै पनि स्क्रिनसट थपिएको छैन।
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                साइट मालिकले पठाउनुभएको मेटा बिजनेस सुइटको स्क्रिनसट यहाँ थप्न सक्नुहुन्छ।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {analyticsScreenshots.map((item: AnalyticsScreenshotItem) => (
                <div
                  key={item.id}
                  className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video bg-slate-900 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={e => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="p-3 space-y-1 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">
                        {item.title}
                      </span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-1">
                        मेट्रिक: {item.metricShown}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        अवधि: {item.reportingPeriod}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 pt-0 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 mt-2">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> मालिकद्वारा प्रमाणित
                    </span>
                    <button
                      onClick={() => deleteScreenshot(item.id)}
                      className="text-rose-600 dark:text-rose-400 hover:text-rose-700 text-xs font-medium p-1 rounded-md transition"
                      title="हटाउनुहोस्"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: DISCLAIMERS & POLICIES */}
      {activePlatformTab === 'disclaimers' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div>
              <label className="block text-slate-900 dark:text-white font-bold mb-1">
                सम्पादकीय समीक्षा तथा पूर्वस्वीकृति नीति (Editorial Review Policy)
              </label>
              <textarea
                rows={3}
                value={config.editorialDisclaimer || ''}
                onChange={e => setConfig({ ...config, editorialDisclaimer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                placeholder="विज्ञापनहरू सम्पादकीय मापदण्ड अनुसार समीक्षा गरिने नीति..."
              />
            </div>

            <div>
              <label className="block text-slate-900 dark:text-white font-bold mb-1">
                स्वतन्त्र सूचना पृष्ठ सूचना (Not a Registered Media Notice)
              </label>
              <textarea
                rows={2}
                value={config.notRegisteredPressNotice || ''}
                onChange={e => setConfig({ ...config, notRegisteredPressNotice: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                placeholder="प्रेस काउन्सिल वा सरकारी दर्ता नभएको तर स्वतन्त्र डिजिटल पृष्ठ भएको जानकारी..."
              />
            </div>

            <div>
              <label className="block text-slate-900 dark:text-white font-bold mb-1">
                वेबसाइट ट्राफिक अस्वीकरण (Website Traffic Disclaimer)
              </label>
              <textarea
                rows={2}
                value={config.webTrafficDisclaimer || ''}
                onChange={e => setConfig({ ...config, webTrafficDisclaimer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                placeholder="काल्पनिक ट्राफिक वा बिक्री ग्यारेन्टी नगरिएको स्पष्ट जानकारी..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
