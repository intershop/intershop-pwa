import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {WishListPageComponent} from './wishlistPage.component';
import {WishlistPageRoutes} from './wishlistPage.routes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(WishlistPageRoutes),
    NgbModule.forRoot(),
  ],
  declarations: [WishListPageComponent],
  providers: []
})

export class WishlistPageModule {
}
