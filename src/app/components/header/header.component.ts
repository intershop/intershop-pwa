import { Component, OnInit } from '@angular/core';
import { CartStatusService } from '../../services/cart-status/cart-status.service';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
  cartItems: string[];

  constructor(
    public localize: LocalizeRouterService,
    private cartStatusService: CartStatusService
  ) {}

  ngOnInit() {
    this.cartStatusService.subscribe((cartItems: string[]) => {
      this.cartItems = cartItems;
    });
  }
}
