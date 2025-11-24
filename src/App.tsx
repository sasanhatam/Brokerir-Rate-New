import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { RateCard } from '@/components/dashboard/RateCard';
import { AssetTable } from '@/components/dashboard/AssetTable';
import { WidgetGenerator } from '@/components/generator/WidgetGenerator';
import { AlertForm } from '@/components/dashboard/AlertForm';
import { WidgetRenderer } from '@/components/widgets/WidgetRenderer';
import { useMarketData } from '@/hooks/useMarketData';
import { LayoutGrid, List, AlertTriangle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Toaster } from '@/components/ui/sonner';

function App() {
  // Check if we are in Widget Mode (iframe)
  const params = new URLSearchParams(window.location.search);
  if (params.get('mode') === 'widget') {
    return <WidgetRenderer />;
  }

  // Normal App Mode
  const { assets, loading, lastUpdated, fallbackMode, refresh } = useMarketData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'fiat' | 'gold' | 'crypto'>('all');

  const filteredAssets = assets.filter(a => filter === 'all' || a.type === filter);
  const topAssets = assets.filter(a => ['usd', 'gold_18k', 'btc'].includes(a.id));

  return (
    <AppShell 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
      loading={loading}
      topAssets={topAssets}
    >
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Fallback Alert */}
          {fallbackMode && (
             <Alert variant="default" className="bg-orange-50 border-orange-200 text-orange-900 rounded-2xl">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertTitle className="text-orange-800 font-bold">محدودیت دسترسی</AlertTitle>
              <AlertDescription className="text-orange-700/90 text-xs mt-1">
                دسترسی مستقیم به سرور قیمت مسدود شده است. قیمت‌ها تقریبی یا بر اساس تتر محاسبه می‌شوند.
              </AlertDescription>
            </Alert>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {(['all', 'gold', 'fiat', 'crypto'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === f 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {f === 'all' ? 'همه' : f === 'gold' ? 'طلا و سکه' : f === 'fiat' ? 'ارزها' : 'رمزارز'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className={`h-8 rounded-lg ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
              >
                <LayoutGrid className="w-4 h-4 ml-2" /> شبکه
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode('list')}
                className={`h-8 rounded-lg ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}
              >
                <List className="w-4 h-4 ml-2" /> لیست
              </Button>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredAssets.map(asset => (
                <RateCard key={asset.id} asset={asset} />
              ))}
            </div>
          ) : (
            <AssetTable assets={filteredAssets} />
          )}
        </div>
      )}

      {activeTab === 'widgets' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <WidgetGenerator assets={assets} />
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="max-w-md mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">تنظیم هشدار قیمت</h2>
              <p className="text-slate-500 mt-2 text-sm">
                برای دریافت هشدار نوسان قیمت، ارز مورد نظر و قیمت هدف را مشخص کنید.
              </p>
            </div>
            <AlertForm assets={assets} />
          </div>
        </div>
      )}

      <Toaster position="bottom-left" dir="rtl" />
    </AppShell>
  );
}

export default App;
