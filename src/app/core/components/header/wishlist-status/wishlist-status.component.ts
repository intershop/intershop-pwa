import { Component, OnInit } from '@angular/core';
import { Wishlist } from '../../../../models/wishlist.model';
import { WishListService } from '../../../services/wishlists/wishlists.service';

@Component({
  selector: 'ish-wishlist-status',
  templateUrl: './wishlist-status.component.html'
})

export class WishListComponent implements OnInit {

  itemCount = 0;

  constructor(
    private wishListService: WishListService
  ) { }

  ngOnInit() {
    this.wishListService.subscribe((wishListData: Wishlist) => {
      this.itemCount = (wishListData) ? wishListData.itemsCount : 0;
    });
  }
}
