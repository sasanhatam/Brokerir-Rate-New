import { PriceAsset } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { getFlagUrl } from '@/lib/flags';

interface WidgetTickerProps {
  assets: PriceAsset[];
  className?: string;
}

export function WidgetTicker({ assets, className }: WidgetTickerProps) {
  // Duplicate assets to ensure smooth infinite scroll loop
  const tickerAssets = [...assets, ...assets, ...assets];

  return (
    <div className={cn("w-full overflow-hidden bg-[#111827] rounded-full py-3", className)}>
      <div className="ticker-wrap">
        <div className="ticker flex items-center gap-8 px-4">
          {tickerAssets.map((asset, index) => {
             const isPositive = asset.change24h > 0;
             const isNegative = asset.change24h < 0;
             // Green for Negative, Red for Positive
             const changeColor = isPositive ? 'text-[#DC2626]' : isNegative ? 'text-[#16A34A]' : 'text-gray-400';
             const ArrowIcon = isPositive ? ArrowUp : isNegative ? ArrowDown : null;
             const flagUrl = getFlagUrl(asset.symbol);

             return (
              <div key={`${asset.id}-${index}`} className="flex items-center gap-3 shrink-0">
                {flagUrl && (
                  <img src={flagUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                )}
                <span className="text-white font-medium text-sm">{asset.symbol}</span>
                <span className="text-white font-bold font-mono">
                  {new Intl.NumberFormat('en-US').format(asset.priceToman)}
                </span>
                <div className={cn("flex items-center text-xs font-bold bg-white/10 px-1.5 py-0.5 rounded", changeColor)}>
                  {ArrowIcon && <ArrowIcon className="w-3 h-3 mr-1" />}
                  <span dir="ltr">{Math.abs(asset.change24h).toFixed(2)}%</span>
                </div>
                <div className="w-[1px] h-4 bg-white/20 ml-4"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
