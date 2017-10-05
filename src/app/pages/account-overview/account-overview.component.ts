import { Component } from '@angular/core';
import { AccountLoginService } from '../../services/account-login';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  templateUrl: './account-overview.component.html'
})

export class AccountOverviewComponent {
  customerName: string;

  constructor(private accountLoginService: AccountLoginService,
    private localize: LocalizeRouterService) {
    this.accountLoginService.subscribe(customerData => {
      if (customerData) {
        this.customerName = customerData.firstName || customerData.userName || customerData.email;
      }
    });
  }

  logout() {
    this.accountLoginService.logout();
    this.localize.navigateToRoute('/home');
  }

}
