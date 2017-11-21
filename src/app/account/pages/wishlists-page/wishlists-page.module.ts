
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { WishListService } from '../../../core/services/wishlists/wishlists.service';
import { SharedModule } from '../../../shared/shared.module';
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
