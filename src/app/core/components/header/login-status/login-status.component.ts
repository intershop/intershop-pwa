import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../../models/customer/customer.model';
import { AccountLoginService } from '../../../services/account-login/account-login.service';

@Component({
  selector: 'ish-login-status',
  templateUrl: './login-status.component.html'
})

export class LoginStatusComponent implements OnInit {

  userDetail: Customer = null;

  constructor(
    private accountLoginService: AccountLoginService
  ) { }

  ngOnInit() {
    this.accountLoginService.subscribe(userDetail => this.userDetail = userDetail);
  }

  get isLoggedIn() {
    return this.accountLoginService.isAuthorized();
  }
}
