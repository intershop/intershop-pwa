import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { AccountLoginService } from '../../../services/account-login/account-login.service';

@Component({
  selector: 'is-login-status',
  templateUrl: './login-status.component.html'
})

export class LoginStatusComponent {

  userDetail: UserDetail = null;

  constructor(
    private router: Router,
    private accountLoginService: AccountLoginService
  ) {
    accountLoginService.subscribe(userDetail => this.userDetail = userDetail);
  }

  get isLoggedIn() {
    return this.accountLoginService.isAuthorized();
  }

  /**
   * navigates to login page
   * @returns void
   */
  logout() {
    this.accountLoginService.logout();
    this.router.navigate(['/home']);
  }
}
