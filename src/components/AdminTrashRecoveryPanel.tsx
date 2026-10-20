import React, { useState, useEffect } from 'react';
import { ContentItem } from '../types';
import { api } from '../services/api';
import {
  Trash2,
  RefreshCw,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  ShieldAlert
} from 'lucide-react';

interface AdminTrashRecoveryPanelProps {
  onContentRestored?: () => void;
}

export const AdminTrashRecoveryPanel: React.FC<AdminTrashRecoveryPanelProps> = ({
  onContentRestored
}) => {
  const [trashItems, setTrashItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadTrash = async () => {
    setLoading(true);
    try {
      const data = await api.getTrashContent();
      setTrashItems(data);
    } catch {
      showNotice('रद्दीटोकरी सूची लोड गर्न असफल', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRestore = async (id: string) => {
    try {
      await api.restoreContent(id);
      setTrashItems(trashItems.filter((i) => i.id !== id));
      showNotice('सामग्री सफलतापूर्वक पुनर्स्थापना (Restore) भयो!');
      if (onContentRestored) onContentRestored();
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'पुनर्स्थापना असफल', 'error');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!window.confirm('सावधानी: यो सामग्री स्थायी रूपमा नष्ट हुनेछ र पछि फिर्ता ल्याउन सकिने छैन। के तपाईं जारी राख्न चाहनुहुन्छ?')) {
      return;
    }
    try {
      await api.permanentDeleteContent(id);
      setTrashItems(trashItems.filter((i) => i.id !== id));
      showNotice('सामग्री स्थायी रूपमा मेटाइयो');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'स्थायी मेटाउन असफल', 'error');
    }
  };

  const handleEmptyTrash = async () => {
    if (trashItems.length === 0) return;
    if (!window.confirm(`सावधानी: रद्दीटोकरीमा रहेका सबै ${trashItems.length} सामग्रीहरू सधैँका लागि नष्ट हुनेछन्। के तपाईं निश्चित हुनुहुन्छ?`)) {
      return;
    }
    try {
      await api.emptyTrash();
      setTrashItems([]);
      showNotice('रद्दीटोकरी पूर्ण रूपमा खाली गरियो!');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'रद्दीटोकरी खाली गर्न असफल', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
            <Trash2 className="w-4 h-4" />
            <span>सुरक्षित रद्दीटोकरी & पुनर्स्थापना (Soft-Delete & Trash Recovery)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            मेटाइएका सामग्रीहरूको पुनःप्राप्ति केन्द्र
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            गलतीले मेटाइएका समाचार वा मस्यौदाहरू यहाँ ३० दिनसम्म सुरक्षित रहन्छन्। तपाईंले सिधै पुनर्स्थापना गर्न वा स्थायी रूपमा नष्ट गर्न सक्नुहुन्छ।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadTrash}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="रिफ्रेस गर्नुहोस्"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {trashItems.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>रद्दीटोकरी खाली गर्नुहोस् ({trashItems.length})</span>
            </button>
          )}
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

      {/* Trash Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {trashItems.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">रद्दीटोकरी खाली छ</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              कुनै पनि मेटाइएका सामग्री रद्दीटोकरीमा फेला परेनन्। कुनै पनि सामग्री सुरक्षित छ।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3.5">सामग्री शीर्षक</th>
                  <th className="p-3.5">श्रेणी</th>
                  <th className="p-3.5">मेटिएको मिति (Deleted At)</th>
                  <th className="p-3.5 text-right">पुनर्स्थापना / स्थायी मेट्ने</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trashItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-medium text-slate-900 max-w-md">
                      <div className="font-bold line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{item.summary}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {item.deletedAt ? new Date(item.deletedAt).toLocaleString('ne-NP') : 'अज्ञात'}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRestore(item.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>पुनर्स्थापना</span>
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(item.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>स्थायी मेट्नुहोस्</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
