import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../services/wishlists/wishlists.service';
import { WishListModel, WishListItem } from '../../services/wishlists/wishlists.model';
import { GlobalState } from '../../services';

@Component({
  templateUrl: './wishlists-page.component.html'
})

export class WishListPageComponent implements OnInit {

  private wishList: WishListItem[] = [];
  /**
   * Constructor
   */
  constructor(private wishListService: WishListService, private globalState: GlobalState) { }

  private updateWishList = (wishListData: WishListModel) => {
    this.wishList = (wishListData) ? wishListData.items : [];
  }

  ngOnInit() {
    this.globalState.subscribe('wishListStatus', this.updateWishList);
    this.globalState.subscribeCachedData('wishListStatus', this.updateWishList);
  }
}
