import { PriceAsset } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatToman, formatPercent, cn } from '@/lib/utils';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { getFlagUrl } from '@/lib/flags';

interface AssetTableProps {
  assets: PriceAsset[];
}

export function AssetTable({ assets }: AssetTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof PriceAsset; direction: 'asc' | 'desc' } | null>(null);

  const sortedAssets = [...assets].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof PriceAsset) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-slate-100">
            <TableHead className="text-right py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ارز / دارایی</TableHead>
            <TableHead className="text-right py-4">
              <Button variant="ghost" onClick={() => handleSort('priceToman')} className="h-8 px-2 text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-wider">
                قیمت (تومان)
                <ArrowUpDown className="mr-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">تغییر ۲۴ ساعته</TableHead>
            <TableHead className="text-right hidden md:table-cell py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">بروزرسانی</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssets.map((asset) => {
             const flagUrl = getFlagUrl(asset.symbol);
             const isPositive = asset.change24h >= 0;
             
             return (
              <TableRow key={asset.id} className="border-slate-50 hover:bg-slate-50/80 transition-colors group">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                      {flagUrl && <img src={flagUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{asset.nameFa}</span>
                      <span className="text-[10px] font-mono text-slate-400">{asset.symbol}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono font-bold text-slate-900 text-base">
                  {formatToman(asset.priceToman).replace(' تومان', '')}
                  <span className="text-[10px] text-slate-400 mr-1 font-normal font-vazir">تومان</span>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md text-xs font-bold",
                    isPositive ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                  )}>
                    {isPositive ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
                    <span dir="ltr">{formatPercent(asset.change24h)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-slate-400 text-xs font-mono" dir="ltr">
                  {new Date(asset.lastUpdated).toLocaleTimeString('fa-IR')}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
