import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketApproval } from 'ish-core/models/basket-approval/basket-approval.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { CustomFields } from 'ish-core/models/custom-field/custom-field.model';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Payment } from 'ish-core/models/payment/payment.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

export interface AbstractBasket<T> {
  id: string;
  purchaseCurrency?: string;
  dynamicMessages?: string[];
  invoiceToAddress?: Address;
  commonShipToAddress?: Address;
  commonShippingMethod?: ShippingMethod;
  customerNo?: string;
  email?: string;
  lineItems?: T[];
  payment?: Payment;
  costCenter?: string;
  promotionCodes?: string[];
  totals: BasketTotal;
  totalProductQuantity?: number;
  bucketId?: string;
  infos?: BasketInfo[];
  approval?: BasketApproval;
  attributes?: Attribute[];
  taxationId?: string;
  user?: {
    companyName?: string;
    companyName2?: string;
    firstName: string;
    lastName: string;
  };
  externalOrderReference?: string;
  messageToMerchant?: string;
  customFields?: CustomFields;
}

export type Basket = AbstractBasket<LineItem>;

export type BasketView = AbstractBasket<LineItemView>;

export const createBasketView = (
  basket: Basket,
  validationResults: BasketValidationResultType,
  basketInfo: BasketInfo[]
): BasketView =>
  basket && {
    ...basket,
    lineItems: basket.lineItems
      ? basket.lineItems
          .map(li => ({
            ...li,
            validationError:
              validationResults && !validationResults.valid && validationResults.errors
                ? validationResults.errors.find(error => error.parameters && error.parameters.lineItemId === li.id)
                : undefined,
            info:
              basketInfo?.length && basketInfo[0].causes
                ? basketInfo[0].causes.find(cause => cause.parameters && cause.parameters.lineItemId === li.id)
                : undefined,
          }))
          .sort(comparePosition)
      : [],
  };

/* Sort basket line items by position as long as the REST request returns them unsorted */
function comparePosition(a: LineItem, b: LineItem) {
  if (a.position < b.position) {
    return -1;
  } else if (a.position < b.position) {
    return 1;
  }
  return 0;
}
