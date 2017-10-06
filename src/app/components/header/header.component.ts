import { Component } from '@angular/core';
import { CartStatusService } from '../../services/cart-status/cart-status.service';

@Component({
  selector: 'is-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent {
  globalnav = true;
  cartItemLength: number;

  constructor(cartStatusService: CartStatusService) {
    cartStatusService.subscribe(this.updateCartItemLength);
  }

  private updateCartItemLength = (cartItems) => {
    this.cartItemLength = cartItems ? cartItems.length : '';
  }
}
