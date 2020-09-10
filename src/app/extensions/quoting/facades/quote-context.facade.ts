import { Injectable, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { pick } from 'lodash-es';
import { Observable, ReplaySubject, Subject, timer } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  sample,
  shareReplay,
  startWith,
  switchMap,
  switchMapTo,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { PriceHelper } from 'ish-core/models/price/price.model';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';

import { QuoteRequestUpdate } from '../models/quote-request-update/quote-request-update.model';
import { QuotingHelper } from '../models/quoting/quoting.helper';
import { Quote, QuoteRequest, QuoteRequestItem } from '../models/quoting/quoting.model';
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

@Injectable()
export abstract class QuoteContextFacade implements OnDestroy {
  constructor(private store: Store) {
    store.pipe(first()).subscribe(state => {
      if (!isQuotingInitialized(state)) {
        this.store.dispatch(loadQuoting());
      }
    });
  }

  private destroy$ = new Subject();

  loading$ = this.store.pipe(select(getQuotingLoading));
  error$ = this.store.pipe(select(getQuotingError));

  entity$ = new ReplaySubject<Quote | QuoteRequest>(1);
  entityAsQuoteRequest$ = this.entity$.pipe(map(QuotingHelper.asQuoteRequest));

  state$ = timer(0, 2000).pipe(switchMapTo(this.entity$.pipe(map(QuotingHelper.state))));

  isQuoteStarted$ = this.entity$.pipe(map(quote => Date.now() > QuotingHelper.asQuote(quote)?.validFromDate));

  isQuoteValid$ = this.entity$.pipe(
    map(QuotingHelper.asQuote),
    map(quote => Date.now() < quote?.validToDate && Date.now() > quote?.validFromDate)
  );

  isQuoteRequestEditable$ = this.entity$.pipe(
    map(QuotingHelper.asQuoteRequest),
    map(quoteRequest => !!quoteRequest.editable)
  );

  private idOnce$ = this.entity$.pipe(
    map(q => q?.id),
    whenTruthy(),
    first()
  );

  form$ = this.entityAsQuoteRequest$
    .pipe(
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
    .pipe(shareReplay(1));

  private formChanges$ = this.form$.pipe(
    switchMap(form =>
      form.valueChanges.pipe(
        startWith(form),
        withLatestFrom(this.entityAsQuoteRequest$),
        map(([, entity]) => this.calculateChanges(form, entity))
      )
    )
  );

  formHasChanges$ = this.formChanges$.pipe(
    map(changes => !!changes?.length),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  );

  formBackedLineItems$ = this.form$.pipe(
    switchMap(form =>
      form.valueChanges.pipe(
        startWith(form),
        withLatestFrom(this.entityAsQuoteRequest$.pipe(map(q => q.items as QuoteRequestItem[]))),
        map(([, items]) => this.convertFormItemsToModel(form, items))
      )
    ),
    shareReplay(1)
  );

  formBackedTotal$ = this.formBackedLineItems$.pipe(
    map(items => items.map(item => item.totals.total).reduce((a, b) => PriceHelper.sum(a, b)))
  );

  protected connect(quoteId$: Observable<string>) {
    this.destroy$.next();
    quoteId$
      .pipe(
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
            sample(this.loading$.pipe(whenFalsy())),
            filter(entity => entity?.completenessLevel === 'Detail'),
            map(entity => entity as Quote | QuoteRequest)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(entity => this.entity$.next(entity));
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

  private convertFormItemsToModel(form: FormGroup, originalItems: QuoteRequestItem[]): QuoteRequestItem[] {
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

  updateItem(item: LineItemUpdate) {
    this.form$.subscribe(form => {
      const items = form.get('items') as FormArray;
      const itemControl = items.controls.find(control => control.value.itemId === item.itemId);
      itemControl?.setValue(pick(item, 'itemId', 'quantity'));
    });
  }

  deleteItem(itemId: string) {
    this.form$.subscribe(form => {
      const items = form.get('items') as FormArray;
      items.removeAt(items.controls.findIndex(control => control.value.itemId === itemId));
    });
  }

  reject() {
    this.idOnce$.subscribe(quoteId => this.store.dispatch(rejectQuote({ quoteId })));
  }

  copy() {
    this.idOnce$.subscribe(quoteId => this.store.dispatch(createQuoteRequestFromQuote({ quoteId })));
  }

  addToBasket() {
    this.idOnce$.subscribe(quoteId => this.store.dispatch(addQuoteToBasket({ quoteId })));
  }

  update() {
    this.idOnce$
      .pipe(withLatestFrom(this.formChanges$))
      .subscribe(([quoteRequestId, changes]) => this.store.dispatch(updateQuoteRequest({ quoteRequestId, changes })));
  }

  submit() {
    this.idOnce$
      .pipe(withLatestFrom(this.formChanges$))
      .subscribe(([quoteRequestId, changes]) =>
        this.store.dispatch(
          changes?.length
            ? updateAndSubmitQuoteRequest({ quoteRequestId, changes })
            : submitQuoteRequest({ quoteRequestId })
        )
      );
  }

  // not-dead-code
  ngOnDestroy() {
    this.destroy$.next();
  }
}
