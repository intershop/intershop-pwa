import { Component, OnInit } from '@angular/core';
import { CartStatusService } from '../../services/cart-status/cart-status.service';

@Component({
  selector: 'is-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
  cartItems: string[];
  navbarCollapsed = true;

  constructor(
    private cartStatusService: CartStatusService
  ) { }

  ngOnInit() {
    this.cartStatusService.subscribe((cartItems: string[]) => {
      this.cartItems = cartItems;
    });
  }
}
