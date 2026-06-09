import { AddressData } from 'ish-core/models/address/address.interface';
import { BasketApprover } from 'ish-core/models/basket-approval/basket-approval.model';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';
import { BasketWarrantyData } from 'ish-core/models/basket-warranty/basket-warranty.interface';
import { CustomFieldData } from 'ish-core/models/custom-field/custom-field.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { PriceAmountData } from 'ish-core/models/price/price.interface';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

export interface RecurringOrderData {
  data: RecurringOrderDetailData;
  included?: {
    discounts?: Record<string, BasketRebateData>;
    lineItems_discounts?: Record<string, BasketRebateData>;
    lineItems_warranty?: Record<string, BasketWarrantyData>;
  };
}

export interface RecurringOrderDetailData extends Omit<RecurringOrderListData, 'totalGross' | 'totalNet'> {
  orderCount?: number;
  totals: BasketTotalData;
  error?: boolean; // error flag if the recurring order was set to inactive by the system
  errorCode?: string;
  statusCode?: string;
  lineItems: LineItemData[];
  shippingBuckets?: [{ shipToAddress: string; shippingMethod: string }];
  shippingMethods?: ShippingMethod[];
  addresses?: AddressData[];
  invoiceToAddress?: string;
  approvalStatuses?: { approvalDate: number; approver: BasketApprover; statusCode: string }[];
  costCenterID?: string;
  costCenterName?: string;
  payments?: PaymentData[];
  paymentMethods?: PaymentMethodBaseData[];
  customFields?: CustomFieldData[];
  lastOrders?: [{ id: string; documentNumber: string; creationDate: string }];
}

export interface RecurringOrderListData {
  id: string;
  number: string;
  active: boolean;
  expired: boolean;
  interval: string;
  startDate: string;
  endDate?: string;
  repetitions?: number;
  creationDate: string;
  lastOrderDate?: string;
  nextOrderDate?: string;
  buyer: BuyerData;
  itemCount: number;
  totalNet: PriceAmountData;
  totalGross: PriceAmountData;
}

interface BuyerData {
  accountID: string;
  companyName?: string;
  customerNo: string;
  email: string;
  firstName: string;
  lastName: string;
  userNo: string;
}
