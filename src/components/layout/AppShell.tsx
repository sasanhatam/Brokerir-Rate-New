import React from 'react';
import { Bell, LayoutDashboard, Code2, RefreshCw, User, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { cn, formatToman, formatPercent } from '@/lib/utils';
import { PriceAsset } from '@/types';
import { Button } from '@/components/ui/button';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  lastUpdated: Date;
  onRefresh: () => void;
  loading: boolean;
  topAssets: PriceAsset[];
}

export function AppShell({ 
  children, 
  activeTab, 
  onTabChange, 
  lastUpdated, 
  onRefresh, 
  loading,
  topAssets 
}: AppShellProps) {
  return (
    <div className="min-h-screen app-shell-bg font-vazir dir-rtl flex flex-col">
      {/* Top Header & Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm">
        
        {/* Main Header Row */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Right: Brand */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  نرخ‌نما
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-1">
                  داشبورد لحظه‌ای بازار آزاد ایران
                </span>
              </div>
            </div>

            {/* Middle: Top Tape (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-6 text-xs overflow-hidden px-4 border-x border-slate-100 mx-4 flex-1 justify-center bg-slate-50/50 rounded-lg py-2">
              {topAssets.slice(0, 3).map(asset => (
                <div key={asset.id} className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-slate-500 font-medium">{asset.nameFa}:</span>
                  <span className="text-slate-900 font-bold font-mono">{formatToman(asset.priceToman).replace(' تومان', '')}</span>
                  <span className={cn(
                    "flex items-center font-medium",
                    asset.change24h >= 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1"/> : <TrendingDown className="w-3 h-3 mr-1"/>}
                    <span dir="ltr">{formatPercent(asset.change24h)}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Left: Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] text-slate-400 font-medium">آخرین بروزرسانی</span>
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700">
                  {loading && <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />}
                  {lastUpdated.toLocaleTimeString('fa-IR')}
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onRefresh} 
                disabled={loading}
                className="rounded-full hover:bg-slate-100 text-slate-500"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>

              <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 text-slate-500">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
              <NavTab 
                active={activeTab === 'dashboard'} 
                onClick={() => onTabChange('dashboard')}
                icon={<LayoutDashboard className="w-4 h-4" />}
              >
                داشبورد قیمت
              </NavTab>
              <NavTab 
                active={activeTab === 'widgets'} 
                onClick={() => onTabChange('widgets')}
                icon={<Code2 className="w-4 h-4" />}
              >
                ساخت ویجت
              </NavTab>
              <NavTab 
                active={activeTab === 'alerts'} 
                onClick={() => onTabChange('alerts')}
                icon={<Bell className="w-4 h-4" />}
              >
                هشدار قیمت
              </NavTab>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {children}
      </main>

      {/* Footer Attribution */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-sm py-6 mt-auto">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-1.5">
            طراحی و توسعه اختصاصی برای وب‌سایت
            <a 
              href="https://brokerir.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5 transition-colors"
            >
              BrokerIR.com
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavTab({ 
  active, 
  children, 
  onClick, 
  icon 
}: { 
  active?: boolean; 
  children: React.ReactNode; 
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
        active
          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
