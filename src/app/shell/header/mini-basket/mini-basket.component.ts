import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, concat, of, timer } from 'rxjs';
import { filter, mapTo, switchMap, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-mini-basket',
  templateUrl: './mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketComponent implements OnInit, OnDestroy {
  basketError$: Observable<HttpError>;
  basketAnimation$: Observable<string>;
  itemTotal$: Observable<PriceItem>;
  itemCount$: Observable<number>;
  lineItems$: Observable<LineItemView[]>;

  isCollapsed = true;

  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  private destroy$ = new Subject();

  constructor(
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private location: Location,
    private cdRef: ChangeDetectorRef
  ) {}

  product$(sku: string) {
    return this.shoppingFacade.product$(sku, ProductCompletenessLevel.List);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.itemCount$ = this.checkoutFacade.basketItemCount$;
    this.itemTotal$ = this.checkoutFacade.basketItemTotal$;
    this.lineItems$ = this.checkoutFacade.basketLineItems$;
    this.basketError$ = this.checkoutFacade.basketError$;

    this.basketError$
      .pipe(
        whenTruthy(),
        filter(() => this.location.path() !== '/basket'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.open());

    this.basketAnimation$ = this.checkoutFacade.basketChange$.pipe(
      filter(() => !this.location.path().startsWith('/basket')),
      switchMap(() => concat(of('tada'), timer(2500).pipe(mapTo(''))))
    );

    this.basketAnimation$.pipe(takeUntil(this.destroy$)).subscribe(animation => {
      if (animation) {
        this.open();
      } else {
        this.collapse();
      }
    });
  }

  /**
   * Toggle the collapse state of the mini basket programmatically.
   */
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * Collapse the mini basket programmatically.
   */
  collapse() {
    this.isCollapsed = true;
    this.cdRef.markForCheck();
  }

  /**
   * Open the mini basket programmatically.
   */
  open() {
    this.isCollapsed = false;
    this.cdRef.markForCheck();
  }
}
