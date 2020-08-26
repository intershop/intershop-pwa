import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { flatten } from 'lodash-es';
import { combineLatest, defer, forkJoin, iif, of } from 'rxjs';
import { concatMap, filter, map, switchMap, take } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';

import { QuoteData } from '../../models/quoting/quoting.interface';
import { QuotingMapper } from '../../models/quoting/quoting.mapper';
import { QuoteCompletenessLevel, QuoteStub } from '../../models/quoting/quoting.model';

@Injectable({ providedIn: 'root' })
export class QuotingService {
  constructor(private apiService: ApiService, private store: Store, private quoteMapper: QuotingMapper) {}

  getQuotes() {
    return combineLatest([this.store.pipe(select(getLoggedInUser)), this.store.pipe(select(getLoggedInCustomer))]).pipe(
      filter(([user, customer]) => !!user && !!customer),
      take(1),
      switchMap(([user, customer]) =>
        forkJoin([
          this.apiService.get(`customers/${customer.customerNo}/users/${user.login}/quoterequests`).pipe(
            unpackEnvelope(),
            map(qrs => qrs.reverse()),
            map((quotes: QuoteData[]) => quotes.map(data => this.quoteMapper.fromData(data, 'QuoteRequest')))
          ),
          this.apiService.get(`customers/${customer.customerNo}/users/${user.login}/quotes`).pipe(
            unpackEnvelope(),
            map(qrs => qrs.reverse()),
            map((quotes: QuoteData[]) => quotes.map(data => this.quoteMapper.fromData(data, 'Quote')))
          ),
        ]).pipe(map(flatten))
      )
    );
  }

  getQuoteDetails(quoteStub: QuoteStub, level: QuoteCompletenessLevel) {
    if (level === 'Stub') {
      return of(quoteStub);
    }
    return combineLatest([this.store.pipe(select(getLoggedInUser)), this.store.pipe(select(getLoggedInCustomer))]).pipe(
      filter(([user, customer]) => !!user && !!customer),
      take(1),
      concatMap(([user, customer]) =>
        quoteStub.type === 'Quote'
          ? this.apiService
              .get<QuoteData>(`customers/${customer.customerNo}/users/${user.login}/quotes/${quoteStub.id}`)
              .pipe(map(res => this.quoteMapper.fromData(res, 'Quote')))
          : this.apiService
              .get<QuoteData>(`customers/${customer.customerNo}/users/${user.login}/quoterequests/${quoteStub.id}`)
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
              )
      )
    );
  }
}
