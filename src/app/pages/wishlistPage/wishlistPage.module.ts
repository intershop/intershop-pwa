import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishListPageComponent } from './wishlistPage.component';
import { WishlistPageRoutes } from './wishlistPage.routes';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(WishlistPageRoutes),
      PopoverModule,
      ModalModule
    ],
    declarations: [WishListPageComponent],
    providers: []
})

export class WishlistPageModule {
}
