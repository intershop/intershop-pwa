import { Component } from '@angular/core';
import { WishListModel } from '../../../../pages/wish-list-page/wish-list-service/wish-list.model';
import { GlobalState } from '../../../../shared/services';

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
  }
};

