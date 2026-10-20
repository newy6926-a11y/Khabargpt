import React, { useState, useEffect } from 'react';
import { TeamMember, UserRole } from '../types';
import { api } from '../services/api';
import {
  Users,
  Shield,
  UserPlus,
  Key,
  Trash2,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Lock,
  RefreshCw
} from 'lucide-react';

export const AdminTeamRolesPanel: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New member form
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    role: 'editor' as UserRole,
    email: '',
    password: ''
  });

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await api.getTeamMembers();
      setTeam(data);
    } catch {
      showNotice('टोली सूची लोड गर्न सकिएन', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.fullName) {
      showNotice('प्रयोगकर्ता नाम, पूरा नाम र पासवर्ड अनिवार्य छन्', 'error');
      return;
    }

    try {
      const created = await api.createTeamMember(formData);
      setTeam([...team, created]);
      setIsModalOpen(false);
      setFormData({ username: '', fullName: '', role: 'editor', email: '', password: '' });
      showNotice('नयाँ टोली सदस्य सफलतापूर्वक थपियो!');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'सदस्य थप्न असफल', 'error');
    }
  };

  const handleDeleteMember = async (id: string, username: string) => {
    if (username === 'admin') {
      showNotice('मुख्य प्रशासक (admin) हटाउन मिल्दैन', 'error');
      return;
    }
    if (!window.confirm(`के तपाईं ${username} लाई टोलीबाट हटाउन चाहनुहुन्छ?`)) return;
    try {
      await api.deleteTeamMember(id);
      setTeam(team.filter((m) => m.id !== id));
      showNotice('सदस्य हटाइयो');
    } catch (err: unknown) {
      showNotice(err instanceof Error ? err.message : 'हटाउन असफल', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>बहु-प्रयोगकर्ता भूमिका र अनुमति (Multi-User Roles & Permissions RBAC)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            सम्पादकीय टोली & पहुँच नियन्त्रण
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Owner (मालिक), Editor (सम्पादक), Reporter (संवाददाता), र Moderator (मध्यस्थकर्ता) का लागि निश्चित अधिकार र भूमिका तोक्नुहोस्।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadTeam}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="रिफ्रेस गर्नुहोस्"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>नयाँ सदस्य थप्नुहोस्</span>
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

      {/* Permissions Matrix Explanation */}
      <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 text-xs space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span>भूमिका र अधिकार म्याट्रिक्स (Roles & Permissions Matrix)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-slate-300">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-red-400 block mb-1">👑 Owner (मालिक):</span>
            सम्पूर्ण अधिकार — साइट सेटिङ, टोली व्यवस्थापन, ब्याकअप रिस्टोर, रद्दीटोकरी खाली गर्ने र आम्दानी हेर्ने।
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-blue-400 block mb-1">✍️ Editor (सम्पादक):</span>
            समाचार तथा एक्सप्लेनर प्रकाशन, सम्पादन, सच्याइ जारी गर्ने र विज्ञापनहरू व्यवस्थापन गर्ने अधिकार।
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-emerald-400 block mb-1">🎤 Reporter (संवाददाता):</span>
            नयाँ समाचार मस्यौदा (Draft) लेख्ने, लाइभ इभेन्ट अपडेट पोस्ट गर्ने अधिकार (प्रकाशन अघि समीक्षा आवश्यक हुन सक्ने)।
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="font-bold text-amber-400 block mb-1">🛡️ Moderator (मध्यस्थकर्ता):</span>
            पाठकहरूको प्रतिक्रिया, टिप्पणी र सच्याइ सुझावहरूको समीक्षा गर्ने अधिकार।
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            सक्रिय टोली सदस्यहरू ({team.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3.5">प्रयोगकर्ता</th>
                <th className="p-3.5">भूमिका (Role)</th>
                <th className="p-3.5">इमेल</th>
                <th className="p-3.5">अन्तिम लगइन</th>
                <th className="p-3.5 text-right">कार्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-medium text-slate-900">
                    <div className="font-bold">{m.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">@{m.username}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        (m.role as string) === 'owner'
                          ? 'bg-red-100 text-red-800'
                          : (m.role as string) === 'editor' || (m.role as string) === 'editor_in_chief'
                          ? 'bg-blue-100 text-blue-800'
                          : (m.role as string) === 'reporter'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">
                    {m.email || '—'}
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px] font-mono">
                    {m.lastLogin ? new Date(m.lastLogin).toLocaleString('ne-NP') : 'हालसम्म छैन'}
                  </td>
                  <td className="p-3.5 text-right">
                    {m.username !== 'admin' && (
                      <button
                        onClick={() => handleDeleteMember(m.id, m.username)}
                        className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                        title="हटाउनुहोस्"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Team Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-red-600" />
              <span>नयाँ सम्पादकीय सदस्य थप्नुहोस्</span>
            </h3>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">पूरा नाम (Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा: सीता शर्मा"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">प्रयोगकर्ता नाम (Username) *</label>
                <input
                  type="text"
                  required
                  placeholder="sita_sharma"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">भूमिका (Role) *</label>
                  <select
                    value={formData.role}
                    onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="editor">Editor (सम्पादक)</option>
                    <option value="reporter">Reporter (संवाददाता)</option>
                    <option value="moderator">Moderator (मध्यस्थकर्ता)</option>
                    <option value="owner">Owner (मालिक)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">इमेल (Email)</label>
                  <input
                    type="email"
                    placeholder="sita@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">सुरक्षित पासवर्ड *</label>
                <input
                  type="password"
                  required
                  placeholder="न्यूनतम ८ अक्षरको पासवर्ड"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  दर्ता गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
