import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Link } from 'ish-core/models/link/link.model';
import { Price } from 'ish-core/models/price/price.model';

import { CostCenter } from './cost-center.model';

export type CostCenterData = Omit<CostCenter, 'orders'> & {
  orders?: {
    orderNo: string;
    orderDate: number[];
    orderStatus: string;
    items: number;
    buyer: { attributes: Attribute[] };
    orderTotalGross: Price;
    orderTotalNet: Price;
  }[];
};

export type CostCenterBaseData = {
  data: Link[];
  info: { limit: number; offset: number; total: number };
};
