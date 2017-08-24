import { Component, OnInit } from '@angular/core';
import {
    WishListService,
} from '../../../pages/wish-list-page/wish-list-service/wish-list-service';
import {
    WishListModel
} from '../../../pages/wish-list-page/wish-list-service/wish-list.model';
import { JwtService, GlobalState } from '../../services';

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
