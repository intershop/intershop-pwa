
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WishListService } from '../../../core/services/wishlists/wishlists.service';
import { SharedModule } from '../../../shared/shared.module';
import { WishListPageComponent } from './wishlists-page.component';
import { wishlistPageRoutes } from './wishlists-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(wishlistPageRoutes),
    SharedModule
  ],
  declarations: [WishListPageComponent],
  providers: [
    WishListService
  ]
})

export class WishlistPageModule {
}
