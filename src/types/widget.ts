import { PriceAsset } from './index';

export type WidgetType = 'grid' | 'ticker' | 'table';
export type WidgetTheme = 'light' | 'dark';

export interface WidgetConfig {
  type: WidgetType;
  assets: string[];
  theme: WidgetTheme;
  title?: string;
}

export interface WidgetProps {
  assets: PriceAsset[];
  className?: string;
  theme?: WidgetTheme;
}
