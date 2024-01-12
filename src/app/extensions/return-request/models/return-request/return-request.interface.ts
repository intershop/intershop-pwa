import { ReturnRequestStatus, ReturnRequestType } from './return-request.model';

export interface ReturnRequestData {
  type: ReturnRequestType;
  rmaNumber: string;
  comment: string;
  id: number;
  creationDate: number;
  shopOrderNumber: string;
  shopName: string;
  supplierOrderNumber: string;
  supplierName: string;
  status: ReturnRequestStatus;
  businessStatus: string;
}

export interface ReturnRequestPositionData {
  id: number;
  positionNumber: number;
  productNumber: string;
  reason: string;
  quantity: number;
  productName: string;
  supplierProductNumber: string;
  customAttributes: unknown[];
}

export interface ReturnableOrdersData {
  positions: {
    positionNumber: number;
    quantity: number;
    items: { productSerialNumber: string }[];
    product: {
      number: string;
      name: string;
    };
  }[];
}

export interface ReturnReasonData {
  name: string;
  description: string;
  type?: string;
}
