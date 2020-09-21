import { Injectable, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { pick } from 'lodash-es';
import { Observable, timer } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  sample,
  skip,
  startWith,
  switchMap,
  switchMapTo,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { PriceHelper } from 'ish-core/models/price/price.model';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import { QuoteRequestUpdate } from '../models/quote-request-update/quote-request-update.model';
import { QuotingHelper } from '../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuoteRequestItem, QuoteStatus } from '../models/quoting/quoting.model';
import {
  addQuoteToBasket,
  createQuoteRequestFromQuote,
  getQuotingEntity,
  getQuotingError,
  getQuotingLoading,
  isQuotingInitialized,
  loadQuoting,
  loadQuotingDetail,
  rejectQuote,
  submitQuoteRequest,
  updateAndSubmitQuoteRequest,
  updateQuoteRequest,
} from '../store/quoting';

export const isQuoteStarted = (state$: Observable<{ entityAsQuote: Quote }>) =>
  state$.pipe(map(state => Date.now() > state.entityAsQuote?.validFromDate));

export const isQuoteValid = (state$: Observable<{ entityAsQuote: Quote }>) =>
  state$.pipe(
    map(state => Date.now() < state.entityAsQuote?.validToDate && Date.now() > state.entityAsQuote?.validFromDate)
  );

export const formHasChanges = (state$: Observable<{ formChanges: QuoteRequestUpdate[] }>) =>
  state$.pipe(
    map(state => !!state.formChanges?.length),
    distinctUntilChanged()
  );

function convertFormItemsToModel(form: FormGroup, originalItems: QuoteRequestItem[]): QuoteRequestItem[] {
  return (form.get('items') as FormArray).controls
    .map(c => c.value as { itemId: string; quantity: number })
    .map(formItem => {
      const originalItem = originalItems.find(item => formItem.itemId === item.id);
      return {
        ...originalItem,
        quantity: { ...originalItem.quantity, value: formItem.quantity },
        totals: {
          total: { ...originalItem.totals.total, value: formItem.quantity * originalItem.singleBasePrice.value },
        },
      };
    });
}

export const formBackedLineItems = (state$: Observable<{ form: FormGroup; entityAsQuoteRequest: QuoteRequest }>) =>
  state$.pipe(
    switchMap(state =>
      state.form.valueChanges.pipe(
        startWith(state.form),
        map(() => convertFormItemsToModel(state.form, state.entityAsQuoteRequest.items as QuoteRequestItem[]))
      )
    )
  );

export const formBackedTotal = (state$: Observable<{ form: FormGroup; entityAsQuoteRequest: QuoteRequest }>) =>
  state$.pipe(
    formBackedLineItems,
    map(items => items?.length && items.map(item => item.totals.total).reduce((a, b) => PriceHelper.sum(a, b)))
  );

@Injectable()
export abstract class QuoteContextFacade
  extends RxState<{
    id: string;
    loading: boolean;
    error: HttpError;
    entity: Quote | QuoteRequest;
    entityAsQuoteRequest: QuoteRequest;
    entityAsQuote: Quote;
    state: QuoteStatus;
    form: FormGroup;
    formChanges: QuoteRequestUpdate[];
    updates: number;
  }>
  implements OnDestroy {
  constructor(private store: Store) {
    super();
    store.pipe(first()).subscribe(state => {
      if (!isQuotingInitialized(state)) {
        this.store.dispatch(loadQuoting());
      }
    });

    this.connect('loading', this.store.pipe(select(getQuotingLoading)));

    this.connect('error', this.store.pipe(select(getQuotingError)));

    this.connect(
      'entity',
      this.select('id').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        switchMap(quoteId =>
          this.store.pipe(
            select(getQuotingEntity(quoteId)),
            whenTruthy(),
            tap(entity => {
              if (entity?.completenessLevel !== 'Detail') {
                this.store.dispatch(loadQuotingDetail({ entity, level: 'Detail' }));
              }
            }),
            sample(this.select('loading').pipe(whenFalsy())),
            filter(entity => entity?.completenessLevel === 'Detail'),
            map(entity => entity as Quote | QuoteRequest)
          )
        ),
        whenTruthy()
      )
    );

    this.connect('entityAsQuoteRequest', this.select('entity').pipe(map(QuotingHelper.asQuoteRequest)));
    this.connect('entityAsQuote', this.select('entity').pipe(map(QuotingHelper.asQuote)));

    this.connect(
      'state',
      timer(0, 2000).pipe(switchMapTo(this.select('entity').pipe(map(QuotingHelper.state))), distinctUntilChanged())
    );

    this.connect(
      'form',
      this.select('entityAsQuoteRequest').pipe(
        map(
          quote =>
            new FormGroup({
              displayName: new FormControl(quote.displayName, [Validators.maxLength(255)]),
              description: new FormControl(quote.description || '', []),
              items: new FormArray(
                quote.items.map(
                  (item: QuoteRequestItem) => new FormControl({ itemId: item.id, quantity: item.quantity.value })
                )
              ),
            })
        )
      )
    );

    this.connect(
      'formChanges',
      this.select('form').pipe(
        switchMap(form =>
          form.valueChanges.pipe(
            startWith(form),
            withLatestFrom(this.select('entityAsQuoteRequest')),
            map(([, entity]) => this.calculateChanges(form, entity))
          )
        )
      )
    );

    this.connect(
      'updates',
      this.select('entity').pipe(
        filter(entity => entity.completenessLevel === 'Detail'),
        skip(1)
      ),
      state => (state.updates || 0) + 1
    );
  }

  private calculateChanges(form: FormGroup, entity: QuoteRequest): QuoteRequestUpdate[] {
    const updates: QuoteRequestUpdate[] = [];

    const displayNameChange = () => form.get('displayName').value !== entity.displayName;
    const descriptionChange = () => form.get('description').value !== (entity.description || '');

    if (displayNameChange() || descriptionChange()) {
      updates.push({
        type: 'meta-data',
        description: form.get('description').value,
        displayName: form.get('displayName').value,
      });
    }

    entity.items.forEach((item: QuoteRequestItem) => {
      const control = (form.get('items') as FormArray).controls.find(c => c.value.itemId === item.id);
      if (!control) {
        updates.push({ type: 'remove-item', itemId: item.id });
      } else if (control.value.quantity !== item.quantity.value) {
        updates.push({ type: 'change-item', itemId: item.id, quantity: control.value.quantity });
      }
    });

    return updates;
  }

  updateItem(item: LineItemUpdate) {
    const items = this.get('form').get('items') as FormArray;
    const itemControl = items.controls.find(control => control.value.itemId === item.itemId);
    itemControl?.setValue(pick(item, 'itemId', 'quantity'));
  }

  deleteItem(itemId: string) {
    const items = this.get('form').get('items') as FormArray;
    items.removeAt(items.controls.findIndex(control => control.value.itemId === itemId));
  }

  reject() {
    this.store.dispatch(rejectQuote({ id: this.get('entity', 'id') }));
  }

  copy() {
    this.store.dispatch(createQuoteRequestFromQuote({ id: this.get('entity', 'id') }));
  }

  addToBasket() {
    this.store.dispatch(addQuoteToBasket({ id: this.get('entity', 'id') }));
  }

  update() {
    this.store.dispatch(updateQuoteRequest({ id: this.get('entity', 'id'), changes: this.get('formChanges') }));
  }

  submit() {
    const changes = this.get('formChanges');
    const id = this.get('entity', 'id');

    if (changes?.length) {
      this.store.dispatch(updateAndSubmitQuoteRequest({ id, changes }));
    } else {
      this.store.dispatch(submitQuoteRequest({ id }));
    }
  }
}
