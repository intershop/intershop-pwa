import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';

/**
 * Displays basket info messages, e.g. if a basket operation has only partly been executed
 *
 * @example
 * <ish-basket-info></ish-basket-info>
 */
@Component({
  selector: 'ish-basket-info',
  templateUrl: './basket-info.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BasketInfoComponent implements OnInit {
  infoMessages$: Observable<BasketInfo[]>;
  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.infoMessages$ = this.checkoutFacade.basketInfo$.pipe(
      map(
        results =>
          results &&
          results.map(info => ({
            ...info,
            causes:
              info &&
              info.causes &&
              info.causes.filter(cause => !cause.parameters || (cause.parameters && !cause.parameters.lineItemId)),
          }))
      )
    );
  }
}
