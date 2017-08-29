import { Component } from '@angular/core';
import { GlobalState } from 'app/services';

@Component({
  selector: 'is-mini-cart',
  templateUrl: './mini-cart.component.html',
})

export class MiniCartComponent {

  public isCollapsed: boolean = true;
  cartPrice: number;
  cartLength: number;
  /**
   * @param  {GlobalState} privateglobalState
   */
  constructor(private globalState: GlobalState) {
    this.globalState.subscribeCachedData('cartData', cartItems => {
      this.calculateCartValues(cartItems);
      this.globalState.subscribe('cartData', (cartData) => {
        this.calculateCartValues(cartData);
      });
    });
  }

  /**
   * Calculate the total price of cart items
   * @param  {} cartItems
   */
  calculateCartValues(cartItems) {
    this.cartPrice = 0;
    this.cartLength = 0;
    if (cartItems.length > 0) {
      cartItems.forEach(item => {
        this.cartPrice = this.cartPrice + item.salePrice.value;
      });
      this.cartLength = cartItems.length;
    }
  }
}
