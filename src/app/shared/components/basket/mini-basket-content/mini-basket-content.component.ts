import { AsyncPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';

@Component({
  selector: 'ish-mini-basket-content',
  templateUrl: './mini-basket-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProductNameComponent,
    ProductImageComponent,
    PricePipe,
    TranslatePipe,
    AsyncPipe,
    ProductContextDirective,
    SlicePipe,
    BasketErrorMessageComponent,
    RouterLink],
})
export class MiniBasketContentComponent implements OnInit {
  /**
   maximum number of displayed items, undefined = display always all items
   */
  maxItemNumber = 25;

  basketError$: Observable<HttpError>;
  lineItems$: Observable<LineItemView[]>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basketError$ = this.checkoutFacade.basketError$;
    this.lineItems$ = this.checkoutFacade.basketLineItems$;
  }
}
