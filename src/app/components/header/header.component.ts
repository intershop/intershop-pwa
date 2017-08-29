import { Component } from '@angular/core';
import { WishListService } from 'app/services/wishlists/wishlists.service';
import { WishListModel } from 'app/services/wishlists/wishlists.model';
import { GlobalState } from 'app/services/global.state';

@Component({
    selector: 'is-header',
    templateUrl: './header.component.html',
})

export class HeaderSlotComponent {
    globalnav: boolean = true;
    constructor(private wishListService: WishListService, private globalState: GlobalState) {
        this.globalState.subscribe('customerDetails', (customerDetails) => {
            if (customerDetails) {
                this.wishListService.getWishList().subscribe(_ => _);
            } else {
                this.globalState.notifyDataChanged('wishListStatus', customerDetails);
            }
        });
    }
}
