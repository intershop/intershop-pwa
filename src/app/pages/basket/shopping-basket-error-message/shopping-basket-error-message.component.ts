import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { MessageFacade } from 'ish-core/facades/message.facade';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Error Message Component displays an error message for an {@link HttpError as well as errors of basket infos and their causes }.
 *
 */
@Component({
  selector: 'ish-shopping-basket-error-message',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketErrorMessageComponent implements OnInit, OnDestroy {
  constructor(private checkoutFacade: CheckoutFacade, private messageFacade: MessageFacade) {}

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.checkoutFacade.basketError$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(error => {
      if (error && !error.causes) {
        this.messageFacade.error({
          message: error.message || error.code,
        });
      }
      if (error?.causes) {
        error?.causes.map(cause => {
          this.messageFacade.error({
            message: cause.message,
          });
        });
      }
    });

    this.checkoutFacade.basketInfoError$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(infoError => {
      if (infoError) {
        infoError?.map(error => {
          this.messageFacade.error({
            message: `<b>${error.message}</b> - ${error.causes?.[0].message} ${error.causes?.[0].parameters?.sku}`,
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
