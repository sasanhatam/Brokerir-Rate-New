import { PriceAsset } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { getFlagUrl } from '@/lib/flags';

interface WidgetTableProps {
  assets: PriceAsset[];
  className?: string;
}

export function WidgetTable({ assets, className }: WidgetTableProps) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100", className)}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset</th>
            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Price (Toman)</th>
            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Change</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, idx) => {
            const isPositive = asset.change24h > 0;
            const isNegative = asset.change24h < 0;
            const changeColor = isPositive ? 'text-[#DC2626]' : isNegative ? 'text-[#16A34A]' : 'text-gray-500';
            const ArrowIcon = isPositive ? ArrowUp : isNegative ? ArrowDown : null;
            const flagUrl = getFlagUrl(asset.symbol);

            return (
              <tr 
                key={asset.id} 
                className={cn(
                  "border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/50",
                  idx % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"
                )}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {flagUrl ? (
                        <img src={flagUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">{asset.symbol.slice(0, 2)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{asset.nameEn}</div>
                      <div className="text-xs text-gray-400">{asset.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-right font-mono font-medium text-gray-900">
                  {new Intl.NumberFormat('en-US').format(asset.priceToman)}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className={cn("inline-flex items-center justify-end gap-1 font-bold text-sm", changeColor)}>
                    {ArrowIcon && <ArrowIcon className="w-3 h-3" />}
                    <span dir="ltr">{Math.abs(asset.change24h).toFixed(2)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
