import { SelectOption } from 'ish-core/models/select-option/select-option.model';

import {
  ReturnReasonData,
  ReturnRequestData,
  ReturnRequestPositionData,
  ReturnableOrdersData,
} from './return-request.interface';
import { ReturnRequest, ReturnRequestPosition, ReturnablePosition } from './return-request.model';

export class ReturnRequestMapper {
  static fromReturnPosition(returnables: ReturnableOrdersData): ReturnablePosition[] {
    return returnables.positions.map(pos => ({
      maxReturnQty: pos.quantity,
      positionNumber: pos.positionNumber,
      sku: pos.product.number,
      productSerialNumbers: pos.items,
      productName: pos.product.name,
    }));
  }

  static fromReturnRequest(returnRequest: ReturnRequestData[], orderId: string): ReturnRequest[] {
    return returnRequest.map(r => ({
      type: r.type,
      id: r.id,
      orderId,
      businessStatus: r.businessStatus,
      creationDate: r.creationDate,
      rmaNumber: r.rmaNumber,
      status: r.status,
    }));
  }

  static fromReturnRequestPosition(returnRequestPosition: ReturnRequestPositionData[]): ReturnRequestPosition[] {
    return returnRequestPosition.map(r => ({
      id: r.id,
      positionNumber: r.positionNumber,
      productNumber: r.productNumber,
      reason: r.reason,
      quantity: r.quantity,
      productName: r.productName,
      supplierProductNumber: r.supplierProductNumber,
      customAttributes: r.customAttributes,
    }));
  }

  static fromReturnReason(data: ReturnReasonData[]): SelectOption[] {
    return data.map(d => ({
      value: d.name,
      label: d.description,
    }));
  }
}
