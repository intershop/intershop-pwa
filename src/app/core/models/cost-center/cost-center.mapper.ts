import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';

import { CostCenterData } from './cost-center.interface';
import { CostCenter } from './cost-center.model';

export class CostCenterMapper {
  static fromData(data: CostCenterData): CostCenter {
    if (data) {
      return {
        ...data,
        orders: data.orders?.map(order => ({
          documentNo: order.orderNo,
          status: order.orderStatus,
          creationDate: order.orderDate.toString(),
          user: {
            firstName: AttributeHelper.getAttributeValueByAttributeName(order.buyer?.attributes, 'firstName'),
            lastName: AttributeHelper.getAttributeValueByAttributeName(order.buyer?.attributes, 'lastName'),
          },
          totalProductQuantity: order.items,
          totals: {
            total: {
              type: 'PriceItem',
              gross: order.orderTotalGross.value,
              net: order.orderTotalNet.value,
              currency: order.orderTotalGross.currency,
            },
            itemTotal: undefined,
            isEstimated: false,
          },
        })),
      };
    } else {
      throw new Error(`'costCenterData' is required for the mapping`);
    }
  }
}
