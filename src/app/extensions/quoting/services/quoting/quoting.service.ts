import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { flatten, pick } from 'lodash-es';
import { EMPTY, Observable, concat, defer, forkJoin, iif, of, throwError } from 'rxjs';
import { concatMap, defaultIfEmpty, expand, filter, last, map, mapTo, take } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { BasketService } from 'ish-core/services/basket/basket.service';

import { QuoteRequestUpdate } from '../../models/quote-request-update/quote-request-update.model';
import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { QuoteData } from '../../models/quoting/quoting.interface';
import { QuotingMapper } from '../../models/quoting/quoting.mapper';
import {
  QuoteCompletenessLevel,
  QuoteRequest,
  QuoteStub,
  QuoteStubFromAttributes,
  QuotingEntity,
} from '../../models/quoting/quoting.model';

@Injectable({ providedIn: 'root' })
export class QuotingService {
  constructor(
    private apiService: ApiService,
    private basketService: BasketService,
    private quoteMapper: QuotingMapper
  ) {}

  getQuotes() {
    return forkJoin([
      this.apiService
        .b2bUserEndpoint()
        .get('quoterequests', {
          params: new HttpParams().set('attrs', 'number,name,lineItems,creationDate,submittedDate'),
        })
        .pipe(
          unpackEnvelope(),
          map(qrs => qrs.reverse()),
          map((quotes: QuoteData[]) => quotes.map(data => this.quoteMapper.fromData(data, 'QuoteRequest')))
        ),
      this.apiService
        .b2bUserEndpoint()
        .get('quotes', {
          params: new HttpParams().set(
            'attrs',
            'number,name,lineItems,creationDate,validFromDate,validToDate,rejected'
          ),
        })
        .pipe(
          unpackEnvelope(),
          map(qrs => qrs.reverse()),
          map((quotes: QuoteData[]) => quotes.map(data => this.quoteMapper.fromData(data, 'Quote')))
        ),
    ]).pipe(map(flatten));
  }

  getQuoteDetails(id: string, type: 'Quote' | 'QuoteRequest', completenessLevel: QuoteCompletenessLevel) {
    if (completenessLevel === 'Stub') {
      return of({ id, type, completenessLevel });
    }
    return type === 'Quote'
      ? this.apiService
          .b2bUserEndpoint()
          .get<QuoteData>(`quotes/${id}`)
          .pipe(map(res => this.quoteMapper.fromData(res, 'Quote')))
      : this.apiService
          .b2bUserEndpoint()
          .get<QuoteData>(`quoterequests/${id}`)
          .pipe(
            concatMap(data =>
              iif(
                () => completenessLevel === 'Detail',
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

  addQuoteToBasket(quoteID: string) {
    return this.basketService.currentBasketEndpoint().post('items', { quoteID }).pipe(mapTo(quoteID));
  }

  createQuoteRequestFromQuote(quoteID: string) {
    return this.apiService
      .b2bUserEndpoint()
      .post<Link>('quoterequests', undefined, { params: new HttpParams().set('quoteID', quoteID) })
      .pipe(map(data => this.quoteMapper.fromData(data, 'QuoteRequest')));
  }

  createQuoteRequestFromQuoteRequest(quoteRequestID: string) {
    return this.apiService
      .b2bUserEndpoint()
      .post<Link>('quoterequests', undefined, { params: new HttpParams().set('quoteRequestID', quoteRequestID) })
      .pipe(map(data => this.quoteMapper.fromData(data, 'QuoteRequest')));
  }

  createQuoteRequestFromBasket(basketID: string) {
    return this.apiService
      .b2bUserEndpoint()
      .post<Link>('quoterequests', undefined, { params: new HttpParams().set('basketID', basketID) })
      .pipe(map(data => this.quoteMapper.fromData(data, 'QuoteRequest')));
  }

  submitQuoteRequest(quoteRequestID: string) {
    return this.apiService
      .b2bUserEndpoint()
      .post<Link>('quotes', { quoteRequestID })
      .pipe(mapTo(quoteRequestID));
  }

  private createQuoteRequest(): Observable<QuoteStub> {
    return this.apiService
      .b2bUserEndpoint()
      .post<Link>('quoterequests')
      .pipe(map(link => this.quoteMapper.fromData(link, 'QuoteRequest')));
  }

  private expansion(stubs: (QuoteStub | QuoteStubFromAttributes)[]) {
    return stubs?.length
      ? (stubs[0].completenessLevel === 'List'
          ? of(stubs[0])
          : this.getQuoteDetails(stubs[0].id, stubs[0].type, 'List')
        ).pipe(
          map(quoteRequest => ({
            quoteRequest,
            next: stubs.slice(1),
          }))
        )
      : EMPTY;
  }

  private getOrCreateActiveQuoteRequest() {
    return this.apiService
      .b2bUserEndpoint()
      .get('quoterequests', {
        params: new HttpParams().set('attrs', 'submittedDate,editable'),
      })
      .pipe(
        unpackEnvelope<Link>(),
        map(qrs => qrs.reverse()),
        map(links => links.map(link => this.quoteMapper.fromData(link, 'QuoteRequest'))),
        concatMap(stubs => this.expansion(stubs)),
        expand(({ next }) => this.expansion(next)),
        map(({ quoteRequest }) => quoteRequest),
        filter(quoteRequest => QuotingHelper.state(quoteRequest) === 'New'),
        take(1),
        defaultIfEmpty(undefined as QuoteRequest)
      )
      .pipe(
        concatMap(active => (active ? of(active) : this.createQuoteRequest())),
        map(QuotingHelper.asQuoteRequest)
      );
  }

  addProductToQuoteRequest(sku: string, quantity: number) {
    return this.getOrCreateActiveQuoteRequest().pipe(
      concatMap(quoteRequest =>
        this.apiService
          .b2bUserEndpoint()
          .post(`quoterequests/${quoteRequest.id}/items`, {
            productSKU: sku,
            quantity: {
              value: quantity,
            },
          })
          .pipe(mapTo(quoteRequest.id))
      )
    );
  }

  updateQuoteRequest(quoteRequestId: string, changes: QuoteRequestUpdate[]) {
    if (!changes?.length) {
      return throwError(new Error('updateQuoteRequest called without changes'));
    }
    return concat(
      ...changes.map(change =>
        change.type === 'meta-data'
          ? this.apiService
              .b2bUserEndpoint()
              .put(`quoterequests/${quoteRequestId}`, pick(change, 'description', 'displayName'))
          : change.type === 'change-item'
          ? this.apiService
              .b2bUserEndpoint()
              .put(`quoterequests/${quoteRequestId}/items/${change.itemId}`, { quantity: { value: change.quantity } })
          : this.apiService.b2bUserEndpoint().delete(`quoterequests/${quoteRequestId}/items/${change.itemId}`)
      )
    ).pipe(last(), mapTo(quoteRequestId));
  }
}
