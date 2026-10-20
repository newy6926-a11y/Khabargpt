import React, { useState, useEffect } from 'react';
import { MarketSnapshot } from '../types';
import { api } from '../services/api';
import {
  TrendingUp,
  DollarSign,
  Flame,
  Award,
  RefreshCw,
  Save,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
  ShieldCheck,
  Eye
} from 'lucide-react';

export const AdminMarketRatesPanel: React.FC = () => {
  const [market, setMarket] = useState<MarketSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadMarket = async () => {
    try {
      setLoading(true);
      const data = await api.getMarketData();
      setMarket(data);
    } catch {
      showNotification('बजार दर लोड गर्न असफल भयो', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarket();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!market) return;

    try {
      setSaving(true);
      const updated = await api.updateMarketRates(market);
      setMarket(updated);
      showNotification('नेपाल बजार तथा आर्थिक दरहरू सफलतापूर्वक अद्यावधिक गरियो!');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'दर अद्यावधिक गर्न असफल भयो', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToVerified = async () => {
    if (!window.confirm('के तपाईं बजार दरहरू २०२६ को प्रमाणित ताजा सार्वजनिक दरहरूमा रिसेट गर्न चाहनुहुन्छ?')) {
      return;
    }

    try {
      setSaving(true);
      const resetData = await api.resetMarketRates();
      setMarket(resetData);
      showNotification('बजार दरहरू २०२६ को प्रमाणित ताजा सूचकहरूमा रिसेट भयो!');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'रिसेट गर्न असफल भयो', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !market) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
        <p className="text-sm text-slate-600 font-medium">बजार तथ्यांक लोड हुँदैछ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 shadow-xs transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              बजार तथा आर्थिक दर व्यवस्थापन (Market Rates & Indices)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            नेप्से, सुन-चाँदी, इन्धन दर र विदेशी विनिमय प्रत्यक्ष व्यवस्थापन गर्नुहोस्। पाठकहरूलाई होमपेजमा यही दर देखिनेछ।
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetToVerified}
            disabled={saving}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200"
            title="प्रमाणित ताजा २०२६ दरहरू लोड गर्नुहोस्"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>प्रमाणित २०२६ दरहरूमा रिसेट</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'सुरक्षित हुँदैछ...' : 'परिवर्तन सुरक्षित गर्नुहोस्'}</span>
          </button>
        </div>
      </div>

      {/* Live Reference Warning & Compliance Alert */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">सार्वजनिक दर तथा प्रतिलिपि अधिकार सुरक्षा नियम:</span>
          <p className="text-[11px] leading-relaxed text-amber-800">
            नेपालका आर्थिक दरहरू (NEPSE, सुनचाँदी, आयल निगम इन्धन र NRB विनिमय) निरन्तर परिवर्तनशील हुन्छन्। खबर GPT मा यी दरहरू खुला सार्वजनिक जानकारीमूलक प्रयोजनका लागि मात्र प्रस्तुत गरिन्छ। तलको फारमबाट तपाईं कुनै पनि समय नयाँ दरहरू अद्यावधिक गर्न सक्नुहुन्छ।
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Date & Attribution Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              अद्यावधिक मिति/समय प्रदर्शन लेबल (Updated Date Label)
            </label>
            <input
              type="text"
              value={market.updatedDate || ''}
              onChange={(e) => setMarket({ ...market, updatedDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium"
              placeholder="उदा: बुधबार, २८ असोज २०८३"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              अद्यावधिक समय (Auto Timestamp)
            </label>
            <button
              type="button"
              onClick={() => {
                const nowStr = new Date().toLocaleDateString('ne-NP', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                setMarket({ ...market, updatedDate: nowStr });
              }}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>अहिलेको नेपाली मिति स्वतः राख्नुहोस्</span>
            </button>
          </div>
        </div>

        {/* 1. NEPSE STOCK EXCHANGE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              १. नेप्से सेयर बजार (NEPSE Stock Market)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                नेप्से परिसूचक (Index Points)
              </label>
              <input
                type="number"
                step="0.01"
                value={market.nepse.index}
                onChange={(e) =>
                  setMarket({
                    ...market,
                    nepse: { ...market.nepse, index: parseFloat(e.target.value) || 0 }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                दैनिक अंक परिवर्तन (+/- Points)
              </label>
              <input
                type="number"
                step="0.01"
                value={market.nepse.change}
                onChange={(e) =>
                  setMarket({
                    ...market,
                    nepse: { ...market.nepse, change: parseFloat(e.target.value) || 0 }
                  })
                }
                className={`w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold ${
                  market.nepse.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                प्रतिशत परिवर्तन (% Change)
              </label>
              <input
                type="number"
                step="0.01"
                value={market.nepse.percentChange}
                onChange={(e) =>
                  setMarket({
                    ...market,
                    nepse: { ...market.nepse, percentChange: parseFloat(e.target.value) || 0 }
                  })
                }
                className={`w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold ${
                  market.nepse.percentChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                कुल कारोबार (Turnover in Crores)
              </label>
              <input
                type="number"
                step="0.01"
                value={market.nepse.turnoverCrores}
                onChange={(e) =>
                  setMarket({
                    ...market,
                    nepse: { ...market.nepse, turnoverCrores: parseFloat(e.target.value) || 0 }
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* 2. GOLD & SILVER (सुन र चाँदी) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              २. सुन र चाँदी दर (Gold & Silver Bullion Rates in NPR)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl">
              <label className="block font-bold text-amber-950 mb-1">
                छापावाल सुन (Fine Gold 9999 / Tola)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">रु.</span>
                <input
                  type="number"
                  value={market.goldSilver.fineGoldTola}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setMarket({
                      ...market,
                      goldSilver: {
                        ...market.goldSilver,
                        fineGoldTola: val,
                        fineGold10g: Math.round((val / 11.664) * 10),
                        tejabiGoldTola: Math.max(0, val - 1500)
                      }
                    });
                  }}
                  className="w-full px-2.5 py-1.5 border border-amber-300 rounded-lg font-mono font-black text-amber-950 text-sm bg-white"
                />
              </div>
              <span className="text-[10px] text-amber-700 mt-1 block">प्रति तोला (११.६६ ग्राम)</span>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl">
              <label className="block font-bold text-amber-950 mb-1">
                तेजाबी सुन (Tejabi Gold / Tola)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">रु.</span>
                <input
                  type="number"
                  value={market.goldSilver.tejabiGoldTola}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      goldSilver: {
                        ...market.goldSilver,
                        tejabiGoldTola: parseInt(e.target.value, 10) || 0
                      }
                    })
                  }
                  className="w-full px-2.5 py-1.5 border border-amber-300 rounded-lg font-mono font-black text-amber-950 text-sm bg-white"
                />
              </div>
              <span className="text-[10px] text-amber-700 mt-1 block">प्रति तोला</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block font-bold text-slate-800 mb-1">
                १० ग्राम छापावाल सुन (10 Grams)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">रु.</span>
                <input
                  type="number"
                  value={market.goldSilver.fineGold10g}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      goldSilver: {
                        ...market.goldSilver,
                        fineGold10g: parseInt(e.target.value, 10) || 0
                      }
                    })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">प्रति १० ग्राम</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block font-bold text-slate-800 mb-1">
                चाँदी (Silver / Tola)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">रु.</span>
                <input
                  type="number"
                  value={market.goldSilver.silverTola}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      goldSilver: {
                        ...market.goldSilver,
                        silverTola: parseInt(e.target.value, 10) || 0
                      }
                    })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">प्रति तोला</span>
            </div>
          </div>
        </div>

        {/* 3. FUEL (इन्धन दर - नेपाल आयल निगम) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Flame className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              ३. पेट्रोलियम तथा इन्धन दर (Fuel Rates - Kathmandu Valley)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block font-bold text-slate-800 mb-1">
                पेट्रोल (Petrol / Litre)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">रु.</span>
                <input
                  type="number"
                  step="0.5"
                  value={market.fuel.petrolLitre}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      fuel: { ...market.fuel, petrolLitre: parseFloat(e.target.value) || 0 }
                    })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">प्रति लिटर</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block font-bold text-slate-800 mb-1">
                डिजेल (Diesel / Litre)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">रु.</span>
                <input
                  type="number"
                  step="0.5"
                  value={market.fuel.dieselLitre}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      fuel: { ...market.fuel, dieselLitre: parseFloat(e.target.value) || 0 }
                    })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">प्रति लिटर</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block font-bold text-slate-800 mb-1">
                मट्टितेल (Kerosene / Litre)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">रु.</span>
                <input
                  type="number"
                  step="0.5"
                  value={market.fuel.keroseneLitre}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      fuel: { ...market.fuel, keroseneLitre: parseFloat(e.target.value) || 0 }
                    })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">प्रति लिटर</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="block font-bold text-slate-800 mb-1">
                एलपी ग्यास (LPG Gas / Cylinder)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">रु.</span>
                <input
                  type="number"
                  value={market.fuel.lpgCylinder}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      fuel: { ...market.fuel, lpgCylinder: parseInt(e.target.value, 10) || 0 }
                    })
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 bg-white"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">प्रति १४.२ केजी सिलिन्डर</span>
            </div>
          </div>
        </div>

        {/* 4. FOREX EXCHANGE (विदेशी मुद्रा विनिमय) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              ४. विदेशी विनिमय दर (Forex Rates - Nepal Rastra Bank NPR)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {/* USD */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">USD (अमेरिकी डलर)</span>
              <div>
                <label className="text-[11px] text-slate-500 block">खरिद दर (Buy)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.usd.buy}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        usd: { ...market.forex.usd, buy: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">बिक्री दर (Sell)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.usd.sell}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        usd: { ...market.forex.usd, sell: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono font-bold"
                />
              </div>
            </div>

            {/* EUR */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">EUR (युरो)</span>
              <div>
                <label className="text-[11px] text-slate-500 block">खरिद दर (Buy)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.eur.buy}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        eur: { ...market.forex.eur, buy: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">बिक्री दर (Sell)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.eur.sell}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        eur: { ...market.forex.eur, sell: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono font-bold"
                />
              </div>
            </div>

            {/* GBP */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">GBP (पाउन्ड)</span>
              <div>
                <label className="text-[11px] text-slate-500 block">खरिद दर (Buy)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.gbp.buy}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        gbp: { ...market.forex.gbp, buy: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">बिक्री दर (Sell)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.gbp.sell}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        gbp: { ...market.forex.gbp, sell: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono font-bold"
                />
              </div>
            </div>

            {/* AED */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">AED (युएई दिर्हाम)</span>
              <div>
                <label className="text-[11px] text-slate-500 block">खरिद दर (Buy)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.aed.buy}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        aed: { ...market.forex.aed, buy: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">बिक्री दर (Sell)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.aed.sell}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        aed: { ...market.forex.aed, sell: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono font-bold"
                />
              </div>
            </div>

            {/* QAR */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block">QAR (कतारी रियाल)</span>
              <div>
                <label className="text-[11px] text-slate-500 block">खरिद दर (Buy)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.qar.buy}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        qar: { ...market.forex.qar, buy: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">बिक्री दर (Sell)</label>
                <input
                  type="number"
                  step="0.01"
                  value={market.forex.qar.sell}
                  onChange={(e) =>
                    setMarket({
                      ...market,
                      forex: {
                        ...market.forex,
                        qar: { ...market.forex.qar, sell: parseFloat(e.target.value) || 0 }
                      }
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-300 rounded bg-white font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. LEGAL DISCLAIMER TEXT */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
          <label className="block font-bold text-slate-800">
            कानूनी सुरक्षा तथा सार्वजनिक सचेतना डिस्क्लेमर (Public Rate Disclaimer)
          </label>
          <textarea
            rows={3}
            value={market.disclaimer}
            onChange={(e) => setMarket({ ...market, disclaimer: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs leading-relaxed"
          />
          <span className="text-[11px] text-slate-500 block">
            यो डिस्क्लेमर पाठकहरूलाई बजार तालिकाको ठिक तल स्पष्ट रूपमा देखाइन्छ।
          </span>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'सुरक्षित गर्दै...' : 'बजार दरहरू तुरुन्त लागू गर्नुहोस्'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
