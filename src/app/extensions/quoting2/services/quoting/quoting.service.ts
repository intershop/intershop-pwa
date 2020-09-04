import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { flatten } from 'lodash-es';
import { defer, forkJoin, iif, of } from 'rxjs';
import { concatMap, map, mapTo } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { QuoteData } from '../../models/quoting/quoting.interface';
import { QuotingMapper } from '../../models/quoting/quoting.mapper';
import { QuoteCompletenessLevel, QuoteStub, QuotingEntity } from '../../models/quoting/quoting.model';

@Injectable({ providedIn: 'root' })
export class QuotingService {
  constructor(private apiService: ApiService, private quoteMapper: QuotingMapper) {}

  private static ATTRS = 'number,name,lineItems,creationDate,validFromDate,validToDate';

  getQuotes() {
    return forkJoin([
      this.apiService
        .b2bUserEndpoint()
        .get('quoterequests', {
          params: new HttpParams().set('attrs', QuotingService.ATTRS),
        })
        .pipe(
          unpackEnvelope(),
          map(qrs => qrs.reverse()),
          map((quotes: QuoteData[]) => quotes.map(data => this.quoteMapper.fromData(data, 'QuoteRequest')))
        ),
      this.apiService
        .b2bUserEndpoint()
        .get('quotes', { params: new HttpParams().set('attrs', QuotingService.ATTRS) })
        .pipe(
          unpackEnvelope(),
          map(qrs => qrs.reverse()),
          map((quotes: QuoteData[]) => quotes.map(data => this.quoteMapper.fromData(data, 'Quote')))
        ),
    ]).pipe(map(flatten));
  }

  getQuoteDetails(quoteStub: QuoteStub, level: QuoteCompletenessLevel) {
    if (level === 'Stub') {
      return of(quoteStub);
    }
    return quoteStub.type === 'Quote'
      ? this.apiService
          .b2bUserEndpoint()
          .get<QuoteData>(`quotes/${quoteStub.id}`)
          .pipe(map(res => this.quoteMapper.fromData(res, 'Quote')))
      : this.apiService
          .b2bUserEndpoint()
          .get<QuoteData>(`quoterequests/${quoteStub.id}`)
          .pipe(
            concatMap(data =>
              iif(
                () => level === 'Detail',
                defer(() =>
                  of(data).pipe(
                    unpackEnvelope('items'),
                    this.apiService.resolveLinks(),
                    map(items => ({ ...data, items }))
                  )
                ),
                of(data)
              )
            ),
            map((res: QuoteData) => this.quoteMapper.fromData(res, 'QuoteRequest'))
          );
  }

  deleteQuote(entity: QuotingEntity) {
    return this.apiService
      .b2bUserEndpoint()
      .delete(`${entity.type === 'Quote' ? 'quotes' : 'quoterequests'}/${entity.id}`)
      .pipe(mapTo(entity.id));
  }

  rejectQuote(quoteId: string) {
    return this.apiService
      .b2bUserEndpoint()
      .put<QuoteData>(`quotes/${quoteId}`, { rejected: true })
      .pipe(map(data => this.quoteMapper.fromData(data, 'Quote')));
  }

  addQuoteToBasket(quoteID: string, basketId: string) {
    return this.apiService.post(`baskets/${basketId}/items`, { quoteID }).pipe(mapTo(quoteID));
  }

  createQuoteRequestFromQuote(quoteID: string) {
    return this.apiService
      .b2bUserEndpoint()
      .post<Link>('quoterequests', { quoteID })
      .pipe(map(data => this.quoteMapper.fromData(data, 'QuoteRequest')));
  }

  submitQuoteRequest(quoteRequestID: string) {
    return this.apiService
      .b2bUserEndpoint()
      .post<Link>('quotes', { quoteRequestID })
      .pipe(mapTo(quoteRequestID));
  }
}
