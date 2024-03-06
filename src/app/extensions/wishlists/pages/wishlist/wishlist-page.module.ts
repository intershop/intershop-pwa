import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { WishlistLineItemComponent } from './wishlist-line-item/wishlist-line-item.component';
import { WishlistPageComponent } from './wishlist-page.component';

const wishlistPageRoutes: Routes = [{ path: ':id', component: WishlistPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(wishlistPageRoutes), SharedModule],
  declarations: [WishlistLineItemComponent, WishlistPageComponent],
})
export class WishlistPageModule {}
