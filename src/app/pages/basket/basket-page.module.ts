import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { BasketOrderRecurrenceEditComponent } from './basket-order-recurrence-edit/basket-order-recurrence-edit.component';
import { BasketPageComponent } from './basket-page.component';
import { ShoppingBasketEmptyComponent } from './shopping-basket-empty/shopping-basket-empty.component';
import { ShoppingBasketPaymentComponent } from './shopping-basket-payment/shopping-basket-payment.component';
import { ShoppingBasketComponent } from './shopping-basket/shopping-basket.component';

const basketPageRoutes: Routes = [{ path: '', component: BasketPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(basketPageRoutes), SharedModule],
  declarations: [
    BasketOrderRecurrenceEditComponent,
    BasketPageComponent,
    ShoppingBasketComponent,
    ShoppingBasketEmptyComponent,
    ShoppingBasketPaymentComponent,
  ],
})
export class BasketPageModule {}
