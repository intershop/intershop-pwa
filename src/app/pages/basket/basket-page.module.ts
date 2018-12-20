import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { BasketPageContainerComponent } from './basket-page.container';
import { ShoppingBasketEmptyComponent } from './components/shopping-basket-empty/shopping-basket-empty.component';
import { ShoppingBasketComponent } from './components/shopping-basket/shopping-basket.component';

const basketPageRoutes: Routes = [{ path: '', component: BasketPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(basketPageRoutes), SharedModule],
  declarations: [BasketPageContainerComponent, ShoppingBasketComponent, ShoppingBasketEmptyComponent],
})
export class BasketPageModule {}
