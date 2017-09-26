import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CartStatusService } from '../../services/cart-status/cart-status.service';
import { Category } from '../../services/categories/categories.model';
import { CategoriesService } from '../../services/categories/categories.service';


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

  constructor(cartStatusService: CartStatusService, private categoryService: CategoriesService) {
    cartStatusService.subscribe(this.updateCartItemLength);
  }

  ngOnInit() {
    this.categoryService.getCategories(this.uri + this.subCategoryDepth).subscribe((response: Category[]) => {
      if (typeof (response) === 'object') {
        this.allCategories = response;
      }
    });
  }

  private updateCartItemLength = (cartItems) => {
    this.cartItemLength = cartItems ? cartItems.length : '';
  }
}
