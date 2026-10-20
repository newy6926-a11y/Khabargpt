import React, { useState, useEffect } from 'react';
import { SavedArticleItem } from '../types';
import { offlineStorage } from '../utils/offlineStorage';
import { X, Bookmark, Trash2, ArrowRight, BookOpen, Clock, WifiOff } from 'lucide-react';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles?: SavedArticleItem[];
  onSelectArticle: (slugOrId: string) => void;
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  isOnline?: boolean;
}

export const SavedArticlesDrawer: React.FC<SavedArticlesDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles: externalArticles,
  onSelectArticle,
  onRemove: externalRemove,
  onClearAll: externalClear,
  isOnline: externalIsOnline
}) => {
  const [internalArticles, setInternalArticles] = useState<SavedArticleItem[]>([]);
  const [internalOnline, setInternalOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (isOpen) {
      setInternalArticles(offlineStorage.getSavedArticles());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleStatus = () => {
      setInternalOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  if (!isOpen) return null;

  const currentList = externalArticles !== undefined ? externalArticles : internalArticles;
  const isOnline = externalIsOnline !== undefined ? externalIsOnline : internalOnline;

  const handleRemove = (id: string) => {
    if (externalRemove) {
      externalRemove(id);
    } else {
      offlineStorage.removeArticle(id);
      setInternalArticles(offlineStorage.getSavedArticles());
    }
  };

  const handleClearAll = () => {
    if (window.confirm('के तपाईं सबै अफलाइन सेभ गरिएका लेखहरू हटाउन चाहनुहुन्छ?')) {
      if (externalClear) {
        externalClear();
      } else {
        offlineStorage.clearAll();
        setInternalArticles([]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <Bookmark className="w-4 h-4 fill-red-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">अफलाइन सुरक्षित सामग्री</h3>
              <p className="text-xs text-slate-500">
                इन्टरनेट नभएको बेला पनि पढ्न सकिने ({currentList.length} सुरक्षित)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline notice if disconnected */}
        {!isOnline && (
          <div className="bg-amber-500 text-slate-950 text-xs px-4 py-2 font-medium flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>इन्टरनेट विच्छेद भएको छ। तपाईंले अफलाइन क्यास गरिएका यी सामग्रीहरू निर्वाध पढ्न सक्नुहुन्छ।</span>
          </div>
        )}

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">कुनै लेख सेभ गरिएको छैन</h4>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                कुनै पनि समाचार वा एक्सप्लेनर पढ्दा 'अफलाइन पढ्न सेभ गर्नुहोस्' बटन थिचेर यहाँ सुरक्षित गर्न सक्नुहुन्छ।
              </p>
            </div>
          ) : (
            currentList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-red-600">{item.category}</span>
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{new Date(item.savedAt).toLocaleDateString('ne-NP')}</span>
                  </div>
                </div>

                <h4
                  onClick={() => {
                    onSelectArticle(item.slug || item.id);
                    onClose();
                  }}
                  className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <button
                    onClick={() => {
                      onSelectArticle(item.slug || item.id);
                      onClose();
                    }}
                    className="text-red-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>पढ्नुहोस्</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                    title="अफलाइनबाट हटाउनुहोस्"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {currentList.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              कुल: {currentList.length} लेख
            </span>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>सबै खाली गर्नुहोस्</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
