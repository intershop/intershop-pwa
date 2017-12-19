
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WishlistsService } from '../../../core/services/wishlists/wishlists.service';
import { SharedModule } from '../../../shared/shared.module';
import { WishlistsPageComponent } from './wishlists-page.component';
import { wishlistsPageRoutes } from './wishlists-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(wishlistsPageRoutes),
    SharedModule
  ],
  declarations: [
    WishlistsPageComponent
  ],
  providers: [
    WishlistsService
  ]
})

export class WishlistsPageModule { }
