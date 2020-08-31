import { Injectable } from '@angular/core';

import { PriceMapper } from 'ish-core/models/price/price.mapper';

import { QuoteData, QuoteRequestLineItemResponse, QuoteRequestResponse, QuoteResponse } from './quoting.interface';
import { Quote, QuoteRequest, QuoteStub } from './quoting.model';

@Injectable({ providedIn: 'root' })
export class QuotingMapper {
  // tslint:disable: no-var-before-return
  fromData(quoteData: QuoteData, type: 'Quote' | 'QuoteRequest'): QuoteStub | Quote | QuoteRequest {
    if (quoteData) {
      if (quoteData.type === 'Link') {
        const mapped: QuoteStub = {
          type,
          id: quoteData.title,
          completenessLevel: 'Stub',
        };
        return mapped;
      } else if (quoteData.type !== type) {
        throw new Error(`expected type '${type}' but received '${quoteData.type}'`);
      } else if (quoteData?.type === 'Quote') {
        const data = quoteData as QuoteResponse;
        const mapped: Quote = {
          type: 'Quote',
          id: data.id,
          completenessLevel: 'Detail',

          number: data.number,
          displayName: data.displayName,
          description: data.description,
          creationDate: data.creationDate,
          total: PriceMapper.fromData(data.total),

          rejected: data.rejected,
          validFromDate: data.validFromDate,
          validToDate: data.validToDate,
          sellerComment: data.sellerComment,
          originTotal: PriceMapper.fromData(data.originTotal),

          items: data.items?.map(item => ({
            id: undefined,
            productSKU: item.productSKU,
            quantity: item.quantity,

            originQuantity: item.originQuantity,

            singleBasePrice: PriceMapper.fromData(item.singlePrice),
            originSingleBasePrice: PriceMapper.fromData(item.originSinglePrice),
            totals: {
              total: PriceMapper.fromData(item.totalPrice),
              originTotal: PriceMapper.fromData(item.originTotalPrice),
            },
          })),
        };
        return mapped;
      } else if (quoteData?.type === 'QuoteRequest') {
        const data = quoteData as QuoteRequestResponse;
        const mapped: QuoteRequest = {
          type: 'QuoteRequest',
          id: data.id,
          completenessLevel: data.items.some(i => i.type === 'Link') ? 'List' : 'Detail',

          number: data.number,
          displayName: data.displayName,
          description: data.description,
          creationDate: data.creationDate,
          total: PriceMapper.fromData(data.total),

          submittedDate: data.submittedDate,
          editable: !!data.editable,

          items: data.items?.map(item => {
            if (item.type === 'Link') {
              return { id: item.title };
            } else {
              const itemData = item as QuoteRequestLineItemResponse;
              return {
                id: itemData.id,
                productSKU: itemData.productSKU,
                quantity: itemData.quantity,
                singleBasePrice: PriceMapper.fromData(itemData.singlePrice),
                totals: { total: PriceMapper.fromData(itemData.totalPrice) },
              };
            }
          }),
        };
        return mapped;
      }
    }
    throw new Error(`valid quoteData is required`);
  }
}
