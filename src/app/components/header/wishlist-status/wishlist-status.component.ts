import { Component } from '@angular/core';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { WishListModel } from '../../../services/wishlists/wishlists.model';
import { WishListService } from '../../../services/wishlists/wishlists.service';

@Component({
  selector: 'is-wishlist-status',
  templateUrl: './wishlist-status.component.html'
})
export class WishListComponent {
  itemCount?: number;

  constructor(wishListService: WishListService, public localize: LocalizeRouterService) {
    wishListService.subscribe(this.updateItemCount);
  }

  private updateItemCount = (wishListData: WishListModel) => {
    this.itemCount = (wishListData) ? wishListData.itemsCount : 0;
  }
}

