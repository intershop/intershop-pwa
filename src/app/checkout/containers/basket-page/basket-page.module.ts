import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { QuotingSharedModule } from '../../../quoting/quoting-shared.module';
import { SharedBasketModule } from '../../../shared/shared-basket.module';
import { SharedModule } from '../../../shared/shared.module';
import { ShoppingSharedModule } from '../../../shopping/shopping-shared.module';
import { CheckoutSharedModule } from '../../checkout-shared.module';
import { ShoppingBasketEmptyComponent } from '../../components/basket/shopping-basket-empty/shopping-basket-empty.component';
import { ShoppingBasketComponent } from '../../components/basket/shopping-basket/shopping-basket.component';

import { BasketPageContainerComponent } from './basket-page.container';
import { basketPageRoutes } from './basket-page.routes';

@NgModule({
  imports: [
    CheckoutSharedModule,
    FormsSharedModule,
    QuotingSharedModule,
    RouterModule.forChild(basketPageRoutes),
    SharedBasketModule,
    SharedModule,
    ShoppingSharedModule,
  ],
  declarations: [BasketPageContainerComponent, ShoppingBasketComponent, ShoppingBasketEmptyComponent],
})
export class BasketPageModule {}
