// NEEDS_WORK: DUMMY COMPONENT
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ish-mini-cart',
  templateUrl: './mini-cart.component.html',
})

export class MiniCartComponent implements OnInit {

  public isCollapsed = true;
  cartPrice: number;
  cartLength: number;

  ngOnInit() {
    // TODO: fetch from store
    this.calculateCartValues([]);
  }

  /**
   * Calculate the total price of cart items
   * @param  {} cartItems
   */
  calculateCartValues = (cartItems) => {
    this.cartPrice = 0;
    this.cartLength = 0;
    if (cartItems && cartItems.length) {
      cartItems.forEach(item => {
        // this.cartPrice = this.cartPrice + item.salePrice.value;
      });
      this.cartLength = cartItems.length;
    }
  }
}
