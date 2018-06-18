import { QuoteRequestItemData } from './quote-request-item.interface';
import { QuoteRequestItem } from './quote-request-item.model';

export class QuoteRequestItemMapper {
  static fromData(data: QuoteRequestItemData, itemId: string) {
    const quoteRequestItem: QuoteRequestItem = {
      id: itemId,
      type: data.type,
      quantity: data.quantity,
      singleBasePrice: data.singlePrice,
      totals: {
        total: data.totalPrice,
      },
      productSKU: data.productSKU,
    };

    return quoteRequestItem;
  }
}
