
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { WishListPageComponent } from './wish-list-page.component';
import { WishlistPageRoutes } from './wish-list-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(WishlistPageRoutes),
    PopoverModule,
    ModalModule
  ],
  declarations: [WishListPageComponent],
  providers: []
})

export class WishlistPageModule {
}
