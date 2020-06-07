export interface OrderTemplateHeader {
  title: string;
}

export interface OrderTemplate extends OrderTemplateHeader {
  id: string;
  items?: OrderTemplateItem[];
  itemsCount?: number;
  creationDate?: Date;
}

export interface OrderTemplateItem {
  sku: string;
  id: string;
  creationDate: number;
  desiredQuantity: {
    value: number;
    unit?: string;
  };
}
