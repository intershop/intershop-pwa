import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

export interface BasketFeedback {
  code: string;
  message: string;
  parameters?: {
    lineItemId?: string;
    productSku?: string;
    shippingRestriction?: string;
    scopes?: string; // data type will change IS-28602
  };
}

export interface BasketFeedbackView extends BasketFeedback {
  product?: ProductView;
  lineItem?: LineItem;
}
