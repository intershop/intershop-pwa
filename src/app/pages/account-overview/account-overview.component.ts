import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountLoginService } from '../../services/account-login/account-login.service';

@Component({
  templateUrl: './account-overview.component.html'
})

export class AccountOverviewComponent {
  customerName: string;

  constructor(private accountLoginService: AccountLoginService,
    private router: Router) {
    this.accountLoginService.subscribe(customerData => {
      if (customerData) {
        this.customerName = customerData.firstName || customerData.userName;
      }
    });
  }

  logout() {
    this.accountLoginService.logout();
    this.router.navigate(['/home']);
  }

}
