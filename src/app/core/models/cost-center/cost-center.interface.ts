import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Price } from 'ish-core/models/price/price.model';

import { CostCenter } from './cost-center.model';

export type CostCenterData = Omit<CostCenter, 'orders'> & {
  orders?: {
    orderNo: string;
    orderDate: number;
    orderStatus: string;
    items: number;
    buyer: { attributes: Attribute[] };
    orderTotalGross: Price;
    orderTotalNet: Price;
  }[];
};
