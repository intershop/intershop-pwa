import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ish-account-navigation',
  templateUrl: './account-navigation.component.html',
})
export class AccountNavigationComponent implements OnInit {

  @Input() selectedItem: string;

  constructor() { }

  ngOnInit() {
  }

}
