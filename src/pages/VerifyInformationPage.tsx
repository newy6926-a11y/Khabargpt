import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Share2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Info,
  Calendar,
  Image as ImageIcon,
  FileCheck,
  AlertOctagon,
  RefreshCw,
  Send,
  Flag
} from 'lucide-react';
import { KhabarLogo } from '../components/KhabarLogo';
import { SiteSettings } from '../types';

interface VerifyInformationPageProps {
  settings?: SiteSettings;
  onNavigate?: (path: string) => void;
}

interface ChecklistItem {
  id: string;
  titleNp: string;
  descNp: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'source-date',
    titleNp: '१. मूल स्रोत र प्रकाशन मिति स्पष्ट छ?',
    descNp: 'कुनै पनि समाचार वा दाबी पढ्दा त्यो कहिले प्रकाशित भएको हो र मूल लेखक वा संस्था को हो भन्ने यकिन गर्नुहोस्।'
  },
  {
    id: 'cross-verify',
    titleNp: '२. कम्तिमा दुई स्वतन्त्र र विश्वसनीय ठाउँमा पुष्टि भयो?',
    descNp: 'एउटै अपुष्ट फेसबुक पोस्ट वा भाइरल भिडियोमा भर नपरी आधिकारिक निकाय वा स्थापित सञ्चार माध्यमहरूमा खोज्नुहोस्।'
  },
  {
    id: 'fact-vs-opinion',
    titleNp: '३. प्रमाणित तथ्य र व्यक्तिगत विचार/आरोप छुट्टिएको छ?',
    descNp: 'अदालत वा आधिकारिक निकायबाट पुष्टि नभएसम्म कसैको व्यक्तिगत दाबी वा आरोपलाई तथ्यको रूपमा नलिनुहोस्।'
  },
  {
    id: 'media-check',
    titleNp: '४. तस्बिर वा भिडियो पुरानो, सम्पादन गरिएको वा AI ले बनाएको छैन?',
    descNp: 'विगतका आन्दोलन वा पुरानो दुर्घटनाका भिडियोलाई आजको भनी फैलाइएको हुन सक्छ। रिभर्स इमेज सर्च गर्नुहोस्।'
  },
  {
    id: 'clickbait-check',
    titleNp: '५. शीर्षक क्लिकबेट (अतिशयोक्तिपूर्ण) त छैन?',
    descNp: 'यदि शीर्षकले धेरै डर, आक्रोश वा उत्तेजना जगाउने भाषा प्रयोग गरेको छ भने सामग्री थप सतर्कतापूर्वक पढ्नुहोस्।'
  },
  {
    id: 'harm-check',
    titleNp: '६. यो शेयर गर्दा समाजमा अनावश्यक भ्रम वा त्रास त फैलिँदैन?',
    descNp: 'अपुष्ट स्वास्थ्य सल्लाह, भूकम्पको नक्कली भविष्यवाणी वा बैंकिङ त्रास सम्बन्धी कुरा शेयर नगर्नु नै जिम्मेवार नागरिकता हो।'
  }
];

export const VerifyInformationPage: React.FC<VerifyInformationPageProps> = ({
  settings,
  onNavigate
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleResetChecklist = () => {
    setCheckedItems({});
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = CHECKLIST_ITEMS.length;

  // Recommendation status
  let statusBadge = {
    title: 'सचेत हुनुहोस्: जाँच अपूर्ण छ',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
    advice: 'कुनै पनि जानकारी शेयर गर्नुअघि माथिका सबै मुख्य बुँदाहरू परीक्षण गर्न सिफारिस गरिन्छ।'
  };

  if (completedCount === totalCount) {
    statusBadge = {
      title: 'उत्कृष्ट: पूर्ण सावधानी अपनाइयो',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      advice: 'तपाईंले सूचनाको विश्वसनीयता परीक्षणका सबै आधारभूत मापदण्डहरू जाँच गर्नुभएको छ।'
    };
  } else if (completedCount >= 4) {
    statusBadge = {
      title: 'सन्तोषजनक: थप १-२ पक्ष जाँच्नुहोस्',
      color: 'bg-blue-100 text-blue-900 border-blue-300',
      advice: 'मूल स्रोत र मिति दोहोर्याएर पक्का गरेपछि मात्र अघि बढ्नुहोला।'
    };
  }

  // Share guide handler
  const handleShareGuide = async () => {
    const text = `खबर GPT सूचना प्रमाणीकरण निर्देशिका: सामाजिक सञ्जालमा कुनै पनि कुरा शेयर गर्नुअघि कसरी तथ्य जाँच गर्ने? पूर्ण गाइड यहाँ हेर्नुहोस्:\n${window.location.origin}/verify-information`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'खबर GPT सूचना प्रमाणीकरण निर्देशिका',
          text
        });
      } catch {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 font-sans">
      {/* 1. Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <KhabarLogo size="sm" customUrl={settings?.customLogoUrl || '/logo.png'} title={settings?.siteTitle || 'Khabar GPT'} />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block">
                नागरिक डिजिटल साक्षरता
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                सूचना प्रमाणीकरण तथा तथ्य जाँच निर्देशिका
              </h1>
            </div>
          </div>

          <button
            onClick={handleShareGuide}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'कपी भयो!' : 'गाइड शेयर गर्नुहोस्'}</span>
          </button>
        </div>

        {/* Mandatory Educational Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs text-amber-950 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              शैक्षिक मार्गनिर्देशन सम्बन्धी अनिवार्य स्पष्टीकरण:
            </p>
            <p className="leading-relaxed text-amber-900">
              यो निर्देशिकाले प्रयोगकर्ताहरूलाई सामाजिक सञ्जाल तथा अनलाइनमा आउने दाबीहरू जाँच्न सामान्य शैक्षिक सहयोग प्रदान गर्दछ। यो कुनै औपचारिक वा न्यायिक तथ्य-जाँच सेवा होइन। यसले प्रत्येक दाबी, स्रोत वा तस्बिरको १००% पूर्णताको ग्यारेन्टी दिँदैन। संवेदनशील तथा कानुनी निर्णयहरूका लागि सधैं सम्बन्धित आधिकारिक निकाय र मूल दस्तावेजहरूकै सहारा लिनुहोला।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Educational Verification Framework */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-600" />
          <span>सामाजिक सञ्जालमा कुनै पनि सूचना शेयर गर्नुअघिका ६ चरणहरू</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase">
              <Calendar className="w-4 h-4" />
              <span>चरण १: मूल स्रोत र मिति पहिचान</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              प्रकाशनको समय र मूल उद्गम कहाँ हो?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              धेरैजसो भाइरल पोस्टहरू वर्षौं पुराना घटनालाई आज घटेको जस्तो बनाएर पुनः फैलाइएका हुन्छन्। घटना भएको वर्ष, महिना र मूल प्रेस विज्ञप्ति जाँच नगरी कहिल्यै अघि नबढ्नुहोस्।
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase">
              <Search className="w-4 h-4" />
              <span>चरण २: स्वतन्त्र क्रस-भेरिफिकेसन</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              के अन्य स्थापित माध्यमले पनि लेखेका छन्?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              कुनै एउटा अज्ञात फेसबुक पेज वा टिकटक अकाउन्टमा आएको सनसनीपूर्ण कुरालाई तत्काल सत्य नमान्नुहोस्। यदि घटना साँचो हो भने कम्तिमा २ वा ३ स्थापित र दर्ता भएका समाचार संस्थामा त्यो रिपोर्टिङ भएको हुनुपर्छ।
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase">
              <FileCheck className="w-4 h-4" />
              <span>चरण ३: तथ्य, आरोप र विचार छुट्याउने</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              के यो प्रमाणित तथ्य हो कि केवल राजनीतिक आरोप?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              “फलानोले यस्तो भन्यो” वा “यस्तो आशंका छ” भन्नु प्रमाणित सत्य होइन। कानुनी फैसला, बैंक स्टेटमेन्ट वा सरकारी अभिलेखबिना लगाइएका आरोपहरूलाई ‘तथ्य’ नभई ‘आरोप’ का रूपमा मात्र बुझ्नुपर्छ।
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase">
              <ImageIcon className="w-4 h-4" />
              <span>चरण ४: तस्बिर तथा भिडियोको सत्यता</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              AI, पुरानो फुटेज वा प्रविधि सम्पादन?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Lens वा TinEye प्रयोग गरेर तस्बिरको पुरानो इतिहास खोज्नुहोस्। AI ले बनाएका मानिसका हातका औंलाहरू, कानका गहना र पृष्ठभूमिमा विकृत अक्षरहरू हेरेर नक्कली दृश्य पहिचान गर्न सकिन्छ।
            </p>
          </div>
        </div>
      </div>

      {/* 3. Three-Tier Claims Classification Framework */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span>दाबीका ३ प्रकार: पुष्टि भएको, विवादित र अपुष्ट (Claims Classification)</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          सञ्चार जगतमा कुनै पनि सूचनालाई यसका कानुनी र प्राविधिक आधार अनुसार ३ वर्गमा छुट्याइन्छ:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>१. पुष्टि भएको (Confirmed Fact)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              सरकारी राजपत्र, अदालतको अन्तिम फैसला वा प्रत्यक्ष प्रमाणिक स्रोतबाट अकाट्य प्रमाणित भइसकेको तथ्य।
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>२. विवादित (Disputed Claim)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              एक पक्षले दाबी गर्ने र अर्को पक्षले अस्वीकार गर्ने अवस्था। यसमा दुवै पक्षका तर्क नआएसम्म निष्कर्ष निकाल्न मिल्दैन।
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
              <AlertOctagon className="w-4 h-4" />
              <span>३. अपुष्ट / हल्ला (Unverified Rumor)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              कुनै पनि कागजी वा आधिकारिक आधार नभएको केवल मुखबाट मुखमा वा सामाजिक सञ्जालमा तैरिएको शंकास्पद कुरा।
            </p>
          </div>
        </div>
      </div>

      {/* 4. Interactive Pre-Share Checklist Tool */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block">
              अन्तरक्रियात्मक टूल (Interactive Tool)
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              पोस्ट शेयर गर्नुपूर्व पूरा गर्नुपर्ने स्व-परीक्षण (Pre-Share Checklist)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-slate-300">
              जाँच सम्पन्न: {completedCount} / {totalCount}
            </span>
            <button
              onClick={handleResetChecklist}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="चेकलिस्ट रिसेट गर्नुहोस्"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          यदि तपाईं कुनै पनि समाचार, तस्बिर वा सन्देश फेसबुक वा अन्यत्र शेयर गर्न लाग्नुभएको छ भने तलका बुँदाहरू एक-एक गरी जाँच्नुहोस्:
        </p>

        {/* Checkboxes List */}
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  isChecked
                    ? 'border-emerald-500/80 bg-emerald-950/40 text-emerald-100'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-600 bg-slate-900'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-0.5">
                  <h4 className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-emerald-300' : 'text-white'}`}>
                    {item.titleNp}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.descNp}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Recommendation Badge */}
        <div className={`p-4 rounded-2xl border ${statusBadge.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div>
            <div className="font-bold text-xs uppercase tracking-wider">{statusBadge.title}</div>
            <div className="text-xs mt-0.5">{statusBadge.advice}</div>
          </div>

          <button
            onClick={handleShareGuide}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors self-start sm:self-auto shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>चेकलिस्ट शेयर</span>
          </button>
        </div>
      </div>

      {/* 5. Corrections & Error Reporting Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase">
          <Flag className="w-4 h-4" />
          <span>त्रुटि सच्याउने र रिपोर्ट गर्ने प्रक्रिया</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          के तपाईंले हाम्रो वेबसाइट वा सामग्रीमा कुनै त्रुटि भेट्टाउनुभयो?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          हामी पूर्ण इमान्दारिताका साथ आफ्ना त्रुटिहरू स्वीकार गर्दछौँ र सार्वजनिक रूपमा सच्याउँछौँ। यदि कुनै लेख, तथ्यांक वा विश्लेषणमा भूल भएको पाउनुभएमा प्रमाणसहित हामीलाई जानकारी गराउनुहोस्।
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('/corrections')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>सार्वजनिक सच्याइ पृष्ठ (Corrections Archive) हेर्नुहोस्</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}

          {onNavigate && (
            <button
              onClick={() => onNavigate('/contact')}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>सच्याइ वा दाबी पठाउनुहोस् (Report Error)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
