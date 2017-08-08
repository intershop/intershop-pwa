import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {WishListPageComponent} from './wish-list-page.component';
import {WishlistPageRoutes} from './wish-list-page.routes';
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
