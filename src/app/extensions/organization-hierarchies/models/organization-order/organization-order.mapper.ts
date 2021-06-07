import { OrderData } from 'ish-core/models/order/order.interface';
import { OrderMapper } from 'ish-core/models/order/order.mapper';
import { Order } from 'ish-core/models/order/order.model';

import { OrderGroupPathData } from '../order-group-path/order-group-path.interface';
import { OrderGroupPathMapper } from '../order-group-path/order-group-path.mapper';
import { OrderGroupPath } from '../order-group-path/order-group-path.model';

export class OrganizationOrderMapper {
  static fromListData(payload: OrderData & OrderGroupPathData): { orders: Order[]; paths: OrderGroupPath[] } {
    if (Array.isArray(payload.data)) {
      let orders = [] as Order[];
      let paths = [] as OrderGroupPath[];

      payload.data.map(data => {
        orders = [...orders, OrderMapper.fromData({ ...payload, data })];
        if (data.buyingContext) {
          paths = [
            ...paths,
            OrderGroupPathMapper.fromData(payload.included.buyingContext[data.buyingContext], data.documentNumber),
          ];
        }
      });
      return { orders, paths };
    }
  }
}
