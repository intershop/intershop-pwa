import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { BasketPageComponent } from './basket-page.component';
import { ShoppingBasketEmptyComponent } from './shopping-basket-empty/shopping-basket-empty.component';
import { ShoppingBasketErrorMessageComponent } from './shopping-basket-error-message/shopping-basket-error-message.component';
import { ShoppingBasketComponent } from './shopping-basket/shopping-basket.component';

const basketPageRoutes: Routes = [{ path: '', component: BasketPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(basketPageRoutes), SharedModule],
  declarations: [
    BasketPageComponent,
    ShoppingBasketComponent,
    ShoppingBasketEmptyComponent,
    ShoppingBasketErrorMessageComponent,
  ],
})
export class BasketPageModule {}
