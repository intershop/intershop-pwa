import { Component, OnInit } from '@angular/core';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { Customer } from '../../../models/customer/customer.model';

@Component({
  templateUrl: './profile-settings-page.component.html'
})
export class ProfileSettingsPageComponent implements OnInit {
  customer: Customer;
  showSuccessMessage: string;

  constructor(
    private accountLoggingService: AccountLoginService
  ) { }

  ngOnInit() {
    this.accountLoggingService.subscribe(customer => {
      if (customer) {
        this.customer = customer;
      }
    });
  }

}
