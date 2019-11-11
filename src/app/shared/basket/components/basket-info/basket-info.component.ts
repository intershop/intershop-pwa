import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';

// tslint:disable:ccp-no-intelligence-in-components
@Component({
  selector: 'ish-basket-info',
  templateUrl: './basket-info.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BasketInfoComponent implements OnInit, OnDestroy {
  info$: Observable<BasketInfo[]>;
  infoMessages: BasketInfo[] = [];

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.info$ = this.checkoutFacade.basketInfo$;

    // update emitted to display spinning animation
    this.info$.pipe(takeUntil(this.destroy$)).subscribe(results => {
      this.infoMessages =
        results &&
        results.map(info => ({
          ...info,
          causes:
            info &&
            info.causes &&
            info.causes.filter(cause => !cause.parameters || (cause.parameters && !cause.parameters.lineItemId)),
        }));

      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
