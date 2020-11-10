import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteItem, QuoteRequestItem } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-line-item-list-element',
  templateUrl: './quote-line-item-list-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteLineItemListElementComponent implements OnChanges, OnInit, OnDestroy {
  @Input() lineItem: Partial<
    Pick<QuoteRequestItem, 'id' | 'productSKU' | 'quantity' | 'singleBasePrice' | 'total'> &
      Pick<
        QuoteItem,
        'id' | 'productSKU' | 'quantity' | 'originSingleBasePrice' | 'singleBasePrice' | 'total' | 'originTotal'
      >
  >;

  isVariationProduct = ProductHelper.isVariationProduct;
  isBundleProduct = ProductHelper.isProductBundle;

  editable$: Observable<boolean>;

  private sku$ = new ReplaySubject<string>(1);
  product$: Observable<ProductView>;
  form$: Observable<FormGroup>;
  private destroy$ = new Subject();

  constructor(private context: QuoteContextFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.editable$ = this.context.select('editable');
    this.product$ = this.shoppingFacade.product$(this.sku$, ProductCompletenessLevel.List);
    this.form$ = this.product$.pipe(
      whenTruthy(),
      map(
        product =>
          new FormGroup({
            quantity: new FormControl(this.lineItem?.quantity?.value, [
              Validators.required,
              Validators.max(product.maxOrderQuantity),
              SpecialValidators.integer,
            ]),
          })
      ),
      shareReplay(1)
    );
    this.form$
      .pipe(
        whenTruthy(),
        switchMap(form => form.get('quantity').valueChanges),
        debounceTime(800),
        takeUntil(this.destroy$)
      )
      .subscribe(quantity => {
        this.context.updateItem({
          itemId: this.lineItem?.id,
          quantity,
        });
      });
  }

  ngOnChanges(): void {
    this.sku$.next(this.lineItem?.productSKU);
  }

  onDeleteItem() {
    this.context.deleteItem(this.lineItem.id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
