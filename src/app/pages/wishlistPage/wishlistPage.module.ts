import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistPageComponent } from './wishlistPage.component';
import { WishlistPageRoutes } from './wishlistPage.routes';
import { PopoverModule } from 'ngx-popover';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(WishlistPageRoutes),
        PopoverModule
        ],
    declarations: [WishlistPageComponent],
    providers: []
})

export class WishlistPageModule {
}
