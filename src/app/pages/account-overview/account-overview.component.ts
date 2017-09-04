import { Component } from '@angular/core';
import { GlobalState } from '../../services';
import { AccountLoginService } from '../../services/account-login';
import { Router } from '@angular/router';

@Component({
    templateUrl: './account-overview.component.html'
})

export class AccountOverviewComponent {
    cusotmerDetailKey: string = 'customerDetails';
    customerName: string;
    constructor(private globalState: GlobalState, private accountLoginService: AccountLoginService,
        private router: Router) {
        this.globalState.subscribeCachedData(this.cusotmerDetailKey, customerData => {
            if (customerData) {
                this.customerName = customerData.firstName;
            }
        })
    }

    logout() {
        this.accountLoginService.logout();
        this.globalState.notifyDataChanged(this.cusotmerDetailKey, null);
        this.router.navigate(['home']);
    }

}
