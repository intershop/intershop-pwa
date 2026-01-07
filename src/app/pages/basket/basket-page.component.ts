import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RecentlyExportsModule } from 'src/app/extensions/recently/exports/recently-exports.module';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { ShoppingBasketEmptyComponent } from './shopping-basket-empty/shopping-basket-empty.component';
import { ShoppingBasketComponent } from './shopping-basket/shopping-basket.component';

@Component({
  selector: 'ish-basket-page',
  templateUrl: './basket-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentIncludeComponent,
    AsyncPipe,
    NgIf,
    ShoppingBasketComponent,
    ShoppingBasketEmptyComponent,
    LoadingComponent,
    RecentlyExportsModule,
  ],
})
export class BasketPageComponent implements OnInit {
  basket$: Observable<BasketView>;
  basketLoading$: Observable<boolean>;
  basketError$: Observable<HttpError>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.basketError$ = this.checkoutFacade.basketError$;
  }

  nextStep() {
    this.checkoutFacade.start();
  }
}
