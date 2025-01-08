import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { WishlistsModule } from '../../wishlists.module';

import { AccountWishlistDetailPageComponent } from './account-wishlist-detail-page.component';

const accountWishlistDetailPageRoutes: Routes = [
  {
    path: '',
    component: AccountWishlistDetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountWishlistDetailPageRoutes), SharedModule, WishlistsModule],
  declarations: [AccountWishlistDetailPageComponent],
})
export class AccountWishlistDetailPageModule {}
