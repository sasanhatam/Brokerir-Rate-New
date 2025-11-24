import { PriceAsset } from '@/types';
import { CurrencyCard } from './CurrencyCard';
import { cn } from '@/lib/utils';

interface WidgetGridProps {
  assets: PriceAsset[];
  className?: string;
}

export function WidgetGrid({ assets, className }: WidgetGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#E9E5E1] rounded-3xl",
      className
    )}>
      {assets.map(asset => (
        <CurrencyCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
