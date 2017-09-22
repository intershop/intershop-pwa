
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SharedModule } from '../../modules/shared.module';
import { WishListService } from '../../services/wishlists/wishlists.service';
import { WishListPageComponent } from './wishlists-page.component';
import { WishlistPageRoutes } from './wishlists-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(WishlistPageRoutes),
    PopoverModule,
    ModalModule,
    SharedModule
  ],
  declarations: [WishListPageComponent],
  providers: [
    WishListService
  ]
})

export class WishlistPageModule {
}
