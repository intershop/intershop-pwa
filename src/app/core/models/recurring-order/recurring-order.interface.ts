import { AddressData } from 'ish-core/models/address/address.interface';
import { BasketApprover } from 'ish-core/models/basket-approval/basket-approval.model';
import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { PriceAmountData } from 'ish-core/models/price/price.interface';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

export interface RecurringOrderData extends Omit<RecurringOrderListData, 'totalNet' | 'totalGross'> {
  orderCount?: number;
  totals: BasketTotalData;
  // error flag if the recurring orders was set to inactive by the system
  error?: boolean;
  errorCode?: string;
  statusCode?: string;

  lineItems: LineItemData[];
  shippingBuckets?: [
    {
      shipToAddress: string;
      shippingMethod: string;
    }
  ];
  shippingMethods?: ShippingMethod[];

  addresses?: AddressData[];
  invoiceToAddress?: string;

  approvalStatuses?: { approvalDate: number; approver: BasketApprover; statusCode: string }[];

  costCenterID?: string;
  costCenterName?: string;

  payments?: PaymentData[];
  paymentMethods?: PaymentMethodBaseData[];
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
