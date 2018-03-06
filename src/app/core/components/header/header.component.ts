import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'ish-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {
  cartItems: string[] = [];
  navbarCollapsed = true;

  ngOnInit() {
    // TODO: fetch cartItems from store
  }
}
