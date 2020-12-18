import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketApproval } from 'ish-core/models/basket-approval/basket-approval.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
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
  promotionCodes?: string[];
  totals: BasketTotal;
  totalProductQuantity?: number;
  bucketId?: string;
  infos?: BasketInfo[];
  approval?: BasketApproval;
  attributes?: Attribute[];
}

export interface Basket extends AbstractBasket<LineItem> {}

export interface BasketView extends AbstractBasket<LineItemView> {}

export const createBasketView = (
  basket: Basket,
  validationResults: BasketValidationResultType,
  basketInfo: BasketInfo[]
): BasketView =>
  basket && {
    ...basket,
    lineItems: basket.lineItems
      ? basket.lineItems.map(li => ({
          ...li,
          validationError:
            validationResults && !validationResults.valid && validationResults.errors
              ? validationResults.errors.find(error => error.parameters && error.parameters.lineItemId === li.id)
              : undefined,
          info:
            basketInfo && basketInfo.length && basketInfo[0].causes
              ? basketInfo[0].causes.find(cause => cause.parameters && cause.parameters.lineItemId === li.id)
              : undefined,
        }))
      : [],
  };
