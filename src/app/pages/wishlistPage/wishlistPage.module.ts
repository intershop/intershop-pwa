import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {WishListPageComponent} from './wishlistPage.component';
import {WishlistPageRoutes} from './wishlistPage.routes';
import {PopoverModule} from 'ngx-bootstrap/popover';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(WishlistPageRoutes),
    PopoverModule
  ],
  declarations: [WishListPageComponent],
  providers: []
})

export class WishlistPageModule {
}
