import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: 'basket', loadChildren: './containers/basket-page/basket-page.module#BasketPageModule' },
  {
    path: 'checkout',
    loadChildren: './containers/checkout-page/checkout-page.module#CheckoutPageModule',
    data: { headerType: 'checkout' },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}
