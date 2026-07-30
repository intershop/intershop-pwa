import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { WishlistsModule } from '../../wishlists.module';

import { AccountWishlistListComponent } from './account-wishlist-list/account-wishlist-list.component';
import { AccountWishlistPageComponent } from './account-wishlist-page.component';

const accountWishlistPageRoutes: Routes = [
  {
    path: '',
    component: AccountWishlistPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountWishlistPageRoutes), SharedModule, WishlistsModule],
  declarations: [AccountWishlistListComponent, AccountWishlistPageComponent],
})
export class AccountWishlistPageModule {}
