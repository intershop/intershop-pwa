import { Component, OnInit } from '@angular/core';
import { WishListModel } from '../../../services/wishlists/wishlists.model';
import { WishListService } from '../../../services/wishlists/wishlists.service';

@Component({
  selector: 'is-wishlist-status',
  templateUrl: './wishlist-status.component.html'
})

export class WishListComponent implements OnInit {

  itemCount = 0;

  constructor(
    private wishListService: WishListService
  ) { }

  ngOnInit() {
    this.wishListService.subscribe((wishListData: WishListModel) => {
      this.itemCount = (wishListData) ? wishListData.itemsCount : 0;
    });
  }
}
