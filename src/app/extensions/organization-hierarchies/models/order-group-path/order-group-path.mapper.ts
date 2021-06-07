import { Injectable } from '@angular/core';



import { OrderGroupPathBaseData } from './order-group-path.interface';
import { OrderGroupPath } from './order-group-path.model';

@Injectable({ providedIn: 'root' })
export class OrderGroupPathMapper {
  static fromData(orderGroupPathData: OrderGroupPathBaseData, orderId: string): OrderGroupPath {
    if (orderGroupPathData) {
      return {
        groupId: orderGroupPathData.groupId,
        groupName: orderGroupPathData.groupName,
        organizationId: orderGroupPathData.organizationId,
        groupPath: orderGroupPathData.groupPath,
        orderId,
      };
    } else {
      throw new Error(`orderGroupPathData is required`);
    }
  }
}
