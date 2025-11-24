import { useState } from 'react';
import { PriceAsset } from '@/types';
import { WidgetGrid } from '@/components/widgets/WidgetGrid';
import { WidgetTicker } from '@/components/widgets/WidgetTicker';
import { WidgetTable } from '@/components/widgets/WidgetTable';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code } from 'lucide-react';
import { toast } from 'sonner';

interface WidgetGeneratorProps {
  assets: PriceAsset[];
}

export function WidgetGenerator({ assets }: WidgetGeneratorProps) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['usd', 'eur', 'gold_18k', 'btc']);
  const [widgetType, setWidgetType] = useState<'grid' | 'ticker' | 'table'>('grid');
  const [copied, setCopied] = useState(false);

  // Filter assets based on selection
  const displayAssets = assets.filter(a => selectedAssets.includes(a.id));

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const generateEmbedCode = () => {
    // Use window.location.origin to get the current app's domain dynamically
    const scriptUrl = `${window.location.origin}/widget-loader.js`;
    
    return `<!-- NerkhTrack Widget -->
<div 
  class="nerkh-widget" 
  data-type="${widgetType}" 
  data-assets="${selectedAssets.join(',')}"
  data-theme="light"
></div>
<script src="${scriptUrl}" async></script>`;
  };

  const copyToClipboard = async () => {
    const code = generateEmbedCode();
    
    try {
      // Try modern API first
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('کد ویجت با موفقیت کپی شد');
    } catch (err) {
      // Fallback for environments where Clipboard API is blocked (e.g. iframes)
      try {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        
        // Ensure it's not visible but part of the DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
           setCopied(true);
           toast.success('کد ویجت با موفقیت کپی شد');
        } else {
           throw new Error('Fallback copy failed');
        }
      } catch (fallbackErr) {
        console.error('Copy failed', fallbackErr);
        toast.error('کپی ناموفق بود. لطفا متن را دستی کپی کنید.');
      }
    }
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Configuration Panel */}
      <div className="lg:col-span-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات ویجت</CardTitle>
            <CardDescription>ویجت قیمت خود را شخصی‌سازی کنید</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <Label>نوع نمایش</Label>
              <Select value={widgetType} onValueChange={(v: any) => setWidgetType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">کارت‌های شبکه (Grid)</SelectItem>
                  <SelectItem value="ticker">نوار متحرک (Ticker)</SelectItem>
                  <SelectItem value="table">جدول قیمت (Table)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>انتخاب ارزها</Label>
              <ScrollArea className="h-[300px] border rounded-md p-4" dir="rtl">
                <div className="space-y-3">
                  {assets.map(asset => (
                    <div key={asset.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id={`asset-${asset.id}`} 
                        checked={selectedAssets.includes(asset.id)}
                        onCheckedChange={() => handleAssetToggle(asset.id)}
                      />
                      <label 
                        htmlFor={`asset-${asset.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 mr-2"
                      >
                        {asset.nameFa} <span className="text-muted-foreground text-xs">({asset.symbol})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

          </CardContent>
        </Card>

        <Card className="bg-slate-950 text-slate-50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-mono flex items-center gap-2">
              <Code className="w-4 h-4" />
              کد امبد (Embed Code)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-slate-900 p-4 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap break-all" dir="ltr">
                {generateEmbedCode()}
              </pre>
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute top-2 right-2 h-8 w-8 hover:bg-slate-800 text-slate-400 hover:text-white"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-8">
        <div className="bg-[#E9E5E1] rounded-xl border shadow-sm h-full flex flex-col overflow-hidden">
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              پیش‌نمایش زنده
            </span>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center min-h-[500px]">
            <div className="w-full max-w-3xl">
              {widgetType === 'grid' && <WidgetGrid assets={displayAssets} />}
              {widgetType === 'ticker' && <WidgetTicker assets={displayAssets} />}
              {widgetType === 'table' && <WidgetTable assets={displayAssets} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
