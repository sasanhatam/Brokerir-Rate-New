import { useMarketData } from '@/hooks/useMarketData';
import { WidgetGrid } from './WidgetGrid';
import { WidgetTicker } from './WidgetTicker';
import { WidgetTable } from './WidgetTable';
import { Loader2 } from 'lucide-react';

export function WidgetRenderer() {
  const { assets, loading } = useMarketData();
  
  // Parse Query Params
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'grid';
  const assetIds = (params.get('assets') || '').split(',').filter(Boolean);
  const theme = params.get('theme') || 'light';

  // Filter assets
  const displayAssets = assetIds.length > 0 
    ? assets.filter(a => assetIds.includes(a.id))
    : assets.slice(0, 4); // Default fallback

  if (loading && assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[100px] bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  // Apply simple theme classes if needed, though most styles are Tailwind classes
  const containerClass = theme === 'dark' ? 'dark' : '';

  return (
    <div className={`w-full h-full ${containerClass} overflow-hidden`}>
      {type === 'grid' && <WidgetGrid assets={displayAssets} className="h-full overflow-auto" />}
      {type === 'ticker' && <WidgetTicker assets={displayAssets} />}
      {type === 'table' && <WidgetTable assets={displayAssets} />}
    </div>
  );
}
