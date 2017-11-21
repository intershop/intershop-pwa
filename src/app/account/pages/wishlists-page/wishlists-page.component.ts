import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../../core/services/wishlists/wishlists.service';
import { WishListItem, WishListModel } from '../../../models/wishlists.model';

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
