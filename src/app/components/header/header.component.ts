import { Component } from '@angular/core';
import { WishListService } from '../../services/wishlists/wishlists.service';
import { GlobalState } from '../../services/global.state';

@Component({
    selector: 'is-header',
    templateUrl: './header.component.html',
})

export class HeaderComponent {
    globalnav = true;
    cartItemLength: number;

    constructor(private wishListService: WishListService, private globalState: GlobalState) {
        this.globalState.subscribe('customerDetails', (customerDetails) => {
            if (customerDetails) {
                this.wishListService.getWishList().subscribe(_ => _);
            } else {
                this.globalState.notifyDataChanged('wishListStatus', customerDetails);
            }
        });

        this.globalState.subscribeCachedData('cartData', (cartItems) => {
            this.cartItemLength = cartItems ? cartItems.length : '';
        });
        this.globalState.subscribe('cartData', (cartItems) => {
            this.cartItemLength = cartItems ? cartItems.length : '';
        });
    }

}
