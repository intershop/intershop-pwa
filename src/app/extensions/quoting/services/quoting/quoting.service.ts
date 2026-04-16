import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, concat, defer, forkJoin, iif, of, throwError } from 'rxjs';
import { concatMap, defaultIfEmpty, last, map, take } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { QuoteRequestUpdate } from '../../models/quote-request-update/quote-request-update.model';
import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { QuoteData } from '../../models/quoting/quoting.interface';
import { QuotingMapper } from '../../models/quoting/quoting.mapper';
import { QuoteCompletenessLevel, QuoteRequest, QuoteStub, QuotingEntity } from '../../models/quoting/quoting.model';

@Injectable({ providedIn: 'root' })
export class QuotingService {
  constructor(
    private apiService: ApiService,
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
    ]).pipe(map(quotes => quotes.flat()));
  }

  getQuoteDetails(id: string, type: 'Quote' | 'QuoteRequest', completenessLevel: QuoteCompletenessLevel) {
    if (completenessLevel === 'Stub') {
      return of({ id, type, completenessLevel });
    }
    return type === 'Quote'
      ? this.apiService
          .b2bUserEndpoint()
          .get<QuoteData>(`quotes/${this.apiService.encodeResourceId(id)}`)
          .pipe(map(res => this.quoteMapper.fromData(res, 'Quote')))
      : this.apiService
          .b2bUserEndpoint()
          .get<QuoteData>(`quoterequests/${this.apiService.encodeResourceId(id)}`)
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
      .delete(`${entity.type === 'Quote' ? 'quotes' : 'quoterequests'}/${this.apiService.encodeResourceId(entity.id)}`)
      .pipe(map(() => entity.id));
  }

  rejectQuote(quoteId: string) {
    return this.apiService
      .b2bUserEndpoint()
      .put<QuoteData>(`quotes/${this.apiService.encodeResourceId(quoteId)}`, { rejected: true })
      .pipe(map(data => this.quoteMapper.fromData(data, 'Quote')));
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
      .pipe(map(() => quoteRequestID));
  }

  private createQuoteRequest(): Observable<QuoteStub> {
    return this.apiService
      .b2bUserEndpoint()
      .post<Link>('quoterequests')
      .pipe(map(link => this.quoteMapper.fromData(link, 'QuoteRequest')));
  }

  private getOrCreateActiveQuoteRequest() {
    return this.apiService
      .b2bUserEndpoint()
      .get('quoterequests', {
        params: new HttpParams().set('attrs', 'submittedDate,creationDate'),
      })
      .pipe(
        unpackEnvelope<Link>(),
        map(links =>
          links
            // map Link data to QuoteRequest
            .map(link => this.quoteMapper.fromData(link, 'QuoteRequest') as QuoteRequest)
            // filter out submitted quote requests, keep only "New" ones
            .filter(quoteRequest => !quoteRequest.submittedDate)
            // sort by creationDate descending
            .sort((qr1, qr2) => qr2.creationDate - qr1.creationDate)
        ),
        // take the most recent "New" quote request
        map(quoteRequests => quoteRequests[0]),
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
          .post(`quoterequests/${this.apiService.encodeResourceId(quoteRequest.id)}/items`, {
            productSKU: sku,
            quantity: { value: quantity },
          })
          .pipe(map(() => quoteRequest.id))
      )
    );
  }

  updateQuoteRequest(quoteRequestId: string, changes: QuoteRequestUpdate[]) {
    if (!changes?.length) {
      return throwError(() => new Error('updateQuoteRequest called without changes'));
    }
    return concat(
      ...changes.map(change =>
        change.type === 'meta-data'
          ? this.apiService
              .b2bUserEndpoint()
              .put(
                `quoterequests/${this.apiService.encodeResourceId(quoteRequestId)}`,
                pick(change, 'description', 'displayName')
              )
          : change.type === 'change-item'
            ? this.apiService
                .b2bUserEndpoint()
                .put(
                  `quoterequests/${this.apiService.encodeResourceId(
                    quoteRequestId
                  )}/items/${this.apiService.encodeResourceId(change.itemId)}`,
                  { quantity: { value: change.quantity } }
                )
            : this.apiService
                .b2bUserEndpoint()
                .delete(
                  `quoterequests/${this.apiService.encodeResourceId(
                    quoteRequestId
                  )}/items/${this.apiService.encodeResourceId(change.itemId)}`
                )
      )
    ).pipe(
      last(),
      map(() => quoteRequestId)
    );
  }
}
