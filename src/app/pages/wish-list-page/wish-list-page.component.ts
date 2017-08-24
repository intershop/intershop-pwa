import { Component, OnInit } from '@angular/core';
import { WishListService } from './wish-list-service/wish-list-service';
import { WishListModel, WishListItem } from './wish-list-service/wish-list.model';

@Component({
  templateUrl: './wish-list-page.component.html'
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
