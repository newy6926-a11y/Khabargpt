import React, { useState, useEffect } from 'react';
import { MarketSnapshot } from '../types';
import { api } from '../services/api';
import { TrendingUp, TrendingDown, AlertTriangle, RefreshCw, DollarSign, Flame, Award, ShieldCheck } from 'lucide-react';

export const MarketTrackerWidget: React.FC = () => {
  const [data, setData] = useState<MarketSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'nepse' | 'gold' | 'fuel' | 'forex'>('nepse');

  const fetchMarket = async (isManual: boolean = false) => {
    try {
      if (isManual) setLoading(true);
      const snapshot = await api.getMarketData();
      setData(snapshot);
    } catch (err) {
      console.warn('Failed to fetch market data:', err);
    } finally {
      if (isManual) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarket(true);
    // Auto-refresh with current time and rate every 30 seconds
    const interval = setInterval(() => {
      fetchMarket(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-28 bg-slate-100 rounded"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-50 text-red-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                नेपाल बजार तथा आर्थिक सूचक (Market & Economy)
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>स्वचालित प्रत्यक्ष अपडेट (Live Auto Rates)</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              आधिकारिक सार्वजनिक खुला तथ्यांक • {data.updatedDate}
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchMarket(true)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-950 font-semibold px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors self-start sm:self-auto cursor-pointer shadow-2xs"
          title="ताजा दर तुरुन्त लोड गर्नुहोस्"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-red-600' : ''}`} />
          <span>दर अद्यावधिक (Refresh)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
        <button
          onClick={() => setActiveTab('nepse')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'nepse'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          नेप्से (NEPSE)
        </button>
        <button
          onClick={() => setActiveTab('gold')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gold'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          सुन-चाँदी (Gold & Silver)
        </button>
        <button
          onClick={() => setActiveTab('fuel')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'fuel'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          इन्धन दर (Fuel)
        </button>
        <button
          onClick={() => setActiveTab('forex')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'forex'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          विदेशी विनिमय (Forex)
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'nepse' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">नेप्से परिसूचक (Index)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {data.nepse.index.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-bold ${
                    data.nepse.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {data.nepse.change >= 0 ? '+' : ''}
                  {data.nepse.change} ({data.nepse.percentChange}%)
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">दैनिक कारोबार (Turnover)</span>
              <div className="mt-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  रु. {data.nepse.turnoverCrores}
                </span>
                <span className="text-xs text-slate-500 ml-1">करोड</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">बजार प्रवृत्ति (Trend)</span>
              <div className="mt-1 flex items-center gap-1.5">
                {data.nepse.change >= 0 ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">सकारात्मक वृद्धि</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-bold text-red-700">सामान्य गिरावट</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 7-Day Trend SVG Chart */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">७ दिने नेप्से प्रवृत्ति (7-Day Historical Trend)</span>
              <span>सार्वजनिक सूचक</span>
            </div>
            <div className="h-28 w-full flex items-end gap-2 pt-4 px-2">
              {data.trends.map((t, idx) => {
                const min = Math.min(...data.trends.map((p) => p.nepse));
                const max = Math.max(...data.trends.map((p) => p.nepse));
                const heightPercent = Math.max(15, Math.round(((t.nepse - min) / (max - min || 1)) * 80) + 15);
                const isLast = idx === data.trends.length - 1;
                return (
                  <div key={t.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                    <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                      {t.nepse}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        isLast ? 'bg-red-500 shadow-md shadow-red-500/30' : 'bg-slate-700 hover:bg-slate-500'
                      }`}
                    ></div>
                    <span className="text-[9px] text-slate-400 truncate w-full text-center">{t.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gold' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
            <span className="text-xs text-amber-900 font-medium">छापावाल सुन (Fine Gold)</span>
            <div className="mt-1">
              <div className="text-lg sm:text-xl font-black text-amber-950">
                रु. {data.goldSilver.fineGoldTola.toLocaleString('en-NP')}
              </div>
              <span className="text-[11px] text-amber-700">प्रति तोला (11.66g)</span>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
            <span className="text-xs text-amber-900 font-medium">तेजाबी सुन (Tejabi Gold)</span>
            <div className="mt-1">
              <div className="text-lg sm:text-xl font-black text-amber-950">
                रु. {data.goldSilver.tejabiGoldTola.toLocaleString('en-NP')}
              </div>
              <span className="text-[11px] text-amber-700">प्रति तोला</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-600 font-medium">१० ग्राम छापावाल</span>
            <div className="mt-1">
              <div className="text-lg sm:text-xl font-black text-slate-900">
                रु. {data.goldSilver.fineGold10g.toLocaleString('en-NP')}
              </div>
              <span className="text-[11px] text-slate-500">प्रति १० ग्राम</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-600 font-medium">चाँदी (Silver)</span>
            <div className="mt-1">
              <div className="text-lg sm:text-xl font-black text-slate-900">
                रु. {data.goldSilver.silverTola.toLocaleString('en-NP')}
              </div>
              <span className="text-[11px] text-slate-500">प्रति तोला</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-600 font-medium">पेट्रोल (Petrol)</span>
            <div className="mt-1">
              <span className="text-lg sm:text-xl font-black text-slate-900">
                रु. {data.fuel.petrolLitre}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ लिटर</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-600 font-medium">डिजेल (Diesel)</span>
            <div className="mt-1">
              <span className="text-lg sm:text-xl font-black text-slate-900">
                रु. {data.fuel.dieselLitre}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ लिटर</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-600 font-medium">मट्टितेल (Kerosene)</span>
            <div className="mt-1">
              <span className="text-lg sm:text-xl font-black text-slate-900">
                रु. {data.fuel.keroseneLitre}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ लिटर</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-600 font-medium">एलपी ग्यास (LPG Gas)</span>
            <div className="mt-1">
              <span className="text-lg sm:text-xl font-black text-slate-900">
                रु. {data.fuel.lpgCylinder}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ सिलिन्डर</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'forex' && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-700">अमेरिकी डलर (USD)</span>
            <div className="text-xs text-slate-500 mt-1">खरिद: रु. {data.forex.usd.buy}</div>
            <div className="text-sm font-black text-slate-900">बिक्री: रु. {data.forex.usd.sell}</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-700">युरो (EUR)</span>
            <div className="text-xs text-slate-500 mt-1">खरिद: रु. {data.forex.eur.buy}</div>
            <div className="text-sm font-black text-slate-900">बिक्री: रु. {data.forex.eur.sell}</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-700">ब्रिटिस पाउन्ड (GBP)</span>
            <div className="text-xs text-slate-500 mt-1">खरिद: रु. {data.forex.gbp.buy}</div>
            <div className="text-sm font-black text-slate-900">बिक्री: रु. {data.forex.gbp.sell}</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-700">युएई दिर्हाम (AED)</span>
            <div className="text-xs text-slate-500 mt-1">खरिद: रु. {data.forex.aed.buy}</div>
            <div className="text-sm font-black text-slate-900">बिक्री: रु. {data.forex.aed.sell}</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-700">कतारी रियाल (QAR)</span>
            <div className="text-xs text-slate-500 mt-1">खरिद: रु. {data.forex.qar.buy}</div>
            <div className="text-sm font-black text-slate-900">बिक्री: रु. {data.forex.qar.sell}</div>
          </div>
        </div>
      )}

      {/* Mandatory Prominent Legal & Public Domain Disclaimer */}
      <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>सार्वजनिक सरोकार तथा वित्तीय डिस्क्लेमर (Public Rate Disclaimer)</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-800">
          {data.disclaimer}
        </p>
      </div>
    </div>
  );
};
