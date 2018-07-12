import { QuoteRequestItemData } from './quote-request-item.interface';
import { QuoteRequestItem } from './quote-request-item.model';

export class QuoteRequestItemMapper {
  static fromData(data: QuoteRequestItemData, itemId: string) {
    const quoteRequestItem: QuoteRequestItem = {
      id: itemId,
      type: data.type,
      quantity: data.quantity,
      originQuantity: data.originQuantity,
      singleBasePrice: data.singlePrice,
      originSingleBasePrice: data.originSinglePrice,
      totals: {
        total: data.totalPrice,
        originTotal: data.originTotalPrice,
      },
      productSKU: data.productSKU,
    };

    return quoteRequestItem;
  }
}
