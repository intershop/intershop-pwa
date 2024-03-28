export type ReturnRequestType = 'RETURN' | 'PICKUP';

export type ReturnRequestStatus = 'ACCEPTED' | 'CLOSED' | 'DO_APPROVE' | 'DO_CLOSE' | 'INITIAL' | 'REJECTED';

export interface ReturnablePosition {
  positionNumber: number;
  maxReturnQty: number;
  productSerialNumbers: { productSerialNumber: string }[];
  sku: string;
  productName: string;
}

export interface ReturnRequestPosition {
  id: number;
  positionNumber: number;
  productNumber: string;
  reason: string;
  quantity: number;
  productName: string;
  supplierProductNumber: string;
  customAttributes: unknown[];
}

export interface ReturnRequest extends Partial<ReturnRequestPosition> {
  type: ReturnRequestType;
  rmaNumber: string;
  id: number;
  orderId: string;
  creationDate: number;
  status: ReturnRequestStatus;
  businessStatus: string;
}

export interface CreateReturnRequestPosition {
  positionNumber: number;
  productNumber: string;
  reason: string;
  quantity: number;
}

export interface CreateReturnRequestPayload {
  type: ReturnRequestType;
  positions: CreateReturnRequestPosition[];
  customAttributes?: { [key: string]: string }[];
}
