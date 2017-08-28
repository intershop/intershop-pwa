import { Component, OnInit } from '@angular/core';
import { WishListService } from 'app/services/wishlists/wishlists.service';
import { WishListModel, WishListItem } from 'app/services/wishlists/wishlists.model';

@Component({
  templateUrl: './wishlists-page.component.html'
})

export class WishListPageComponent implements OnInit {

  wishList: WishListItem[] = [];
  /**
   * Constructor
   */
  constructor(private wishListService: WishListService) { };

  ngOnInit() {
    this.wishListService.getWishList().subscribe((wishListData: WishListModel) => {
      this.wishList = wishListData.items;
    });
  };
};
