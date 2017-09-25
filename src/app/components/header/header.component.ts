import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';
import { GlobalState } from '../../services/global.state';
import { WishListService } from '../../services/wishlists/wishlists.service';

@Component({
  selector: 'is-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
  globalnav = true;
  cartItemLength: number;
  subCategoryDepth: number = environment.subCategoryDepth;
  allCategories: Category[];
  uri = 'categories?view=tree&limit=';

  constructor(private wishListService: WishListService, private globalState: GlobalState,
    private categoryService: CategoriesService
  ) {
    this.globalState.subscribe('customerDetails', (customerDetails) => {
      if (customerDetails) {
        this.wishListService.getWishList().subscribe(_ => _);
      } else {
        this.globalState.notifyDataChanged('wishListStatus', customerDetails);
      }
    });

    this.globalState.subscribeCachedData('cartData', (cartItems) => {
      this.cartItemLength = cartItems ? cartItems.length : '';
    });
    this.globalState.subscribe('cartData', (cartItems) => {
      this.cartItemLength = cartItems ? cartItems.length : '';
    });
  }

  ngOnInit() {
    this.categoryService.getCategories(this.uri + this.subCategoryDepth).subscribe((response: Category[]) => {
      if (typeof (response) === 'object') {
        this.allCategories = response;
      }
    });
  }
}
