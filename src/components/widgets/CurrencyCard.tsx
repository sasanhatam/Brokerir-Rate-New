import { PriceAsset } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { getFlagUrl } from '@/lib/flags';

interface CurrencyCardProps {
  asset: PriceAsset;
  className?: string;
}

export function CurrencyCard({ asset, className }: CurrencyCardProps) {
  const isPositive = asset.change24h > 0;
  const isNegative = asset.change24h < 0;

  // Design System: Green (#16A34A) for Negative, Red (#DC2626) for Positive
  const changeColor = isPositive ? 'text-[#DC2626]' : isNegative ? 'text-[#16A34A]' : 'text-gray-500';
  const ArrowIcon = isPositive ? ArrowUp : isNegative ? ArrowDown : null;

  const flagUrl = getFlagUrl(asset.symbol);

  return (
    <div className={cn(
      "bg-white rounded-[24px] p-5 relative overflow-hidden",
      "shadow-[0_16px_32px_rgba(15,23,42,0.06)]",
      "hover:shadow-[0_20px_40px_rgba(15,23,42,0.1)] transition-shadow duration-300",
      className
    )}>
      {/* Header Row */}
      <div className="flex justify-between items-start mb-2">
        {/* Flag / Icon */}
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
          {flagUrl ? (
            <img src={flagUrl} alt={asset.symbol} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-gray-400">{asset.symbol.slice(0, 2)}</span>
          )}
        </div>

        {/* Name & Symbol */}
        <div className="text-right">
          <h3 className="font-bold text-[#333333] text-base leading-tight">{asset.nameEn}</h3>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{asset.symbol}</span>
        </div>
      </div>

      {/* Change Indicator */}
      <div className={cn("flex items-center gap-1 text-sm font-medium mb-1", changeColor)}>
        {ArrowIcon && <ArrowIcon className="w-4 h-4 stroke-[2.5]" />}
        <span dir="ltr">{Math.abs(asset.change24h).toFixed(2)}%</span>
      </div>

      {/* Big Price */}
      <div className="mt-1">
        <span className="text-3xl font-bold text-black tracking-tight">
          {new Intl.NumberFormat('en-US').format(asset.priceToman)}
        </span>
        <span className="text-xs text-gray-400 ml-1 font-normal">Toman</span>
      </div>
    </div>
  );
}
