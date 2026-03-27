import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Link } from 'ish-core/models/link/link.model';
import { PagingInfo } from 'ish-core/models/paging-info/paging-info.model';
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

export interface CostCenterListData {
  data: Link[];
  info: PagingInfo;
}
