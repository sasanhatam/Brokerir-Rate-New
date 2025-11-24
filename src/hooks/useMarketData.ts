import { useState, useEffect } from 'react';
import { PriceAsset } from '@/types';
import { getPrices } from '@/services/priceService';
import { toast } from 'sonner';

export function useMarketData() {
  const [assets, setAssets] = useState<PriceAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [fallbackMode, setFallbackMode] = useState(false);

  const fetchData = async (force = false) => {
    if (!force) setLoading(true);
    try {
      const data = await getPrices(force);
      setAssets(data);
      setLastUpdated(new Date());
      
      const usd = data.find(a => a.id === 'usd');
      const isFallback = usd?.source === 'nobitex' || data.some(a => a.type === 'gold' && a.source === 'nerkh.io' && a.priceToman === 4500000); 
      setFallbackMode(isFallback);
    } catch (error) {
      console.error(error);
      // Only show toast if it's a manual refresh or critical error, to avoid spamming widgets
      if (force) toast.error('خطا در دریافت اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { assets, loading, lastUpdated, fallbackMode, refresh: () => fetchData(true) };
}
