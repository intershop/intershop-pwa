
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { WishListPageComponent } from './wishlists-page.component';
import { WishlistPageRoutes } from './wishlists-page.routes';
import { WishListService } from '../../services/wishlists/wishlists.service';
import { SharedModule } from '../../modules/shared.module';

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
