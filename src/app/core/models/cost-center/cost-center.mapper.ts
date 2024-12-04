import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Link } from 'ish-core/models/link/link.model';

import { CostCenterData } from './cost-center.interface';
import { CostCenter } from './cost-center.model';

export class CostCenterMapper {
  /* map cost center data from link list attributes,
  some data are missing like orders or buyer assignments that have to be fetched with the details call */
  static fromListData(data: Link[]): CostCenter[] {
    if (!data?.length) {
      return [];
    }
    return data.map(cc => ({
      id: cc.itemId,
      costCenterId: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'costCenterId'),
      name: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'name'),
      active: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'active'),
      costCenterOwner: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'costCenterOwner'),
      budget: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'budget'),
      budgetPeriod: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'budgetPeriod'),
      pendingOrders: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'pendingOrders'),
      approvedOrders: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'approvedOrders'),
      spentBudget: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'spentBudget'),
      remainingBudget: AttributeHelper.getAttributeValueByAttributeName(cc.attributes, 'remainingBudget'),
    }));
  }

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
