import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { BasketErrorMessageComponent } from '../basket-error-message/basket-error-message.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ish-mini-basket-content',
  templateUrl: './mini-basket-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProductNameComponent,
    ProductImageComponent,
    PricePipe,
    TranslateModule,
    NgIf,
    AsyncPipe,
    NgFor,
    ProductContextDirective,
    SlicePipe,
    BasketErrorMessageComponent,
    RouterLink,
  ],
})
@GenerateLazyComponent()
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
