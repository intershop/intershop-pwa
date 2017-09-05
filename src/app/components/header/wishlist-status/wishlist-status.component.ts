import { Component } from '@angular/core';
import { WishListModel } from '../../../services/wishlists/wishlists.model';
import { GlobalState } from '../../../services';

@Component({
  selector: 'is-wishlist-status',
  templateUrl: './wishlist-status.component.html'
})
export class WishListComponent {
  itemCount?: number;
  constructor(private globalState: GlobalState) {
    this.globalState.subscribe('wishListStatus', (wishListData: WishListModel) => {
      this.itemCount = (wishListData) ? wishListData.itemsCount : 0;
    });
    this.globalState.subscribeCachedData('wishListStatus', (wishListCachedData) => {
      this.globalState.notifyDataChanged('wishListStatus', wishListCachedData);
    });
  }
}

