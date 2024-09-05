import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Observable, concat, of, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-mini-basket',
  templateUrl: './mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketComponent implements OnInit {
  @ViewChild('miniBasketDropdown', { static: true }) miniBasketDropdown!: NgbDropdown;

  basketAnimation$: Observable<string>;
  itemTotal$: Observable<PriceItem>;
  itemCount$: Observable<number>;
  basketLoading$: Observable<boolean>;

  isCollapsed = true;

  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  private basketError$: Observable<HttpError>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private checkoutFacade: CheckoutFacade,
    private appFacade: AppFacade,
    private location: Location,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.itemCount$ = this.checkoutFacade.basketItemCount$;
    this.itemTotal$ = this.checkoutFacade.basketItemTotal$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;

    this.basketError$
      .pipe(
        whenTruthy(),
        filter(() => this.location.path() !== '/basket'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.open());

    this.basketAnimation$ = this.checkoutFacade.basketChange$.pipe(
      filter(() => !this.location.path().startsWith('/basket')),
      switchMap(() => concat(of('mini-basket-animation'), timer(2500).pipe(map(() => ''))))
    );

    this.basketAnimation$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(animation => {
      if (animation) {
        this.open();
      } else {
        this.collapse();
      }
    });

    this.appFacade.routingInProgress$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.collapse();
    });
  }

  /**
   * Collapse the mini basket programmatically.
   */
  collapse() {
    this.isCollapsed = true;
    this.miniBasketDropdown.close();
    this.cdRef.markForCheck();
  }

  /**
   * Open the mini basket programmatically.
   */
  // visible-for-testing
  open() {
    this.isCollapsed = false;
    this.miniBasketDropdown.open();
    this.cdRef.markForCheck();
  }
}
