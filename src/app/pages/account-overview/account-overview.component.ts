import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalState } from '../../services';
import { AccountLoginService } from '../../services/account-login';

@Component({
  templateUrl: './account-overview.component.html'
})

export class AccountOverviewComponent {
  cusotmerDetailKey = 'customerDetails';
  customerName: string;
  constructor(private globalState: GlobalState, private accountLoginService: AccountLoginService,
    private router: Router) {
    this.globalState.subscribeCachedData(this.cusotmerDetailKey, customerData => {
      if (customerData) {
        this.customerName = customerData.firstName || customerData.userName;
      }
    });
  }

  logout() {
    this.accountLoginService.logout();
    this.globalState.notifyDataChanged(this.cusotmerDetailKey, null);
    this.router.navigate(['home']);
    return false;
  }

}
