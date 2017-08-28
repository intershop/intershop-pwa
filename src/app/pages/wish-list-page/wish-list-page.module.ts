
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { WishListPageComponent } from './wish-list-page.component';
import { WishlistPageRoutes } from './wish-list-page.routes';
import { WishListService } from './wish-list-service/wish-list-service';
import { SharedModule } from '../../shared/shared-modules/shared.module';

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
