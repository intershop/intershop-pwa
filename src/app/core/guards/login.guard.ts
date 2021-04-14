import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { filter, first } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { setReturnUrl } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { LoginModalComponent } from 'ish-shared/components/login/login-modal/login-modal.component';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  private currentDialog: NgbModalRef;
  private isMobile: boolean;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade
  ) {
    this.appFacade.deviceType$.pipe(first()).subscribe(type => (this.isMobile = type === 'mobile'));
  }

  async canActivate(route: ActivatedRouteSnapshot, goal: RouterStateSnapshot) {
    // first request should go to page
    if (!this.router.navigated) {
      return true;
    }

    // mobile view should not use modal
    if (this.isMobile) {
      return true;
    }

    // force page view by queryParam
    if (route.queryParams.forcePageView) {
      return true;
    }

    this.currentDialog = this.modalService.open(LoginModalComponent, { centered: true, size: 'sm' });

    const loginModalComponent = this.currentDialog.componentInstance as LoginModalComponent;
    loginModalComponent.loginMessageKey = route.queryParamMap.get('messageKey');

    this.accountFacade.setReturnUrl(goal.root.queryParamMap.get('returnUrl'));
    // dialog closed
    loginModalComponent.close.pipe(first()).subscribe(() => {
      this.currentDialog.dismiss();
    });

    // navigated away with link on dialog
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        first()
      )
      .subscribe(() => {
        this.currentDialog.dismiss();
      });

    // login successful
    this.accountFacade.isLoggedIn$.pipe(whenTruthy(), first()).subscribe(() => {
      this.currentDialog.dismiss();
    });

    return false;
  }
}
