import { Component, OnInit } from '@angular/core';
import { WishListItem, WishListModel } from '../../services/wishlists/wishlists.model';
import { WishListService } from '../../services/wishlists/wishlists.service';

@Component({
  templateUrl: './wishlists-page.component.html'
})
export class WishListPageComponent implements OnInit {

  wishList: WishListItem[] = [];

  constructor(
    private wishListService: WishListService
  ) { }

  ngOnInit() {
    this.wishListService.subscribe(this.updateWishList);
  }

  private updateWishList = (wishListData: WishListModel) => {
    this.wishList = (wishListData) ? wishListData.items : [];
  }
}
