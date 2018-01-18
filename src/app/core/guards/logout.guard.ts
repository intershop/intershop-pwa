import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountLoginService } from '../services/account-login/account-login.service';


@Injectable()
export class LogoutGuard implements CanActivate {

  constructor(private router: Router,
    private accountLoginService: AccountLoginService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.accountLoginService.logout();
    this.router.navigate(['/home']);
    return true;
  }
}
