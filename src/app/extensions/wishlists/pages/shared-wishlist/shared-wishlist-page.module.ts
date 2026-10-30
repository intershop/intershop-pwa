import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { WishlistsModule } from '../../wishlists.module';

import { SharedWishlistPageComponent } from './shared-wishlist-page.component';

const wishlistPageRoutes: Routes = [{ path: '', component: SharedWishlistPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(wishlistPageRoutes), SharedModule, WishlistsModule],
  declarations: [SharedWishlistPageComponent],
})
export class SharedWishlistPageModule {}
