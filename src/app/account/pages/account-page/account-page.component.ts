import { Component, OnInit } from '@angular/core';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { Customer } from '../../../models/customer/customer.model';

@Component({
  templateUrl: './account-page.component.html'
})

export class AccountPageComponent implements OnInit {
  customer: Customer;

  constructor(
    private accountLoginService: AccountLoginService
  ) { }

  ngOnInit() {
    this.accountLoginService.subscribe(customer => {
      if (customer) {
        this.customer = customer;
      }
    });
  }
}
