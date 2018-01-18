// NEEDS_WORK: DUMMY COMPONENT
import { Component, OnInit } from '@angular/core';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';

@Component({
  templateUrl: './account-page.component.html'
})

export class AccountPageComponent implements OnInit {
  customerName: string;

  constructor(
    private accountLoginService: AccountLoginService
  ) { }

  ngOnInit() {
    this.accountLoginService.subscribe(customer => {
      if (customer) {
        this.customerName = customer.getDisplayName();
      }
    });
  }
}
