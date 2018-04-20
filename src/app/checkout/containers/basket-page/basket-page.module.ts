import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { ShoppingSharedModule } from '../../../shopping/shopping-shared.module';
import { CheckoutSharedModule } from '../../checkout-shared.module';
import { BasketPageContainerComponent } from './basket-page.container';
import { basketPageRoutes } from './basket-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(basketPageRoutes),
    SharedModule,
    CheckoutSharedModule,
    ShoppingSharedModule,
    FormsSharedModule,
  ],
  declarations: [BasketPageContainerComponent],
})
export class BasketPageModule {}
