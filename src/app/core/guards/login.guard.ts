import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { filter, first } from 'rxjs/operators';

import { getDeviceType } from 'ish-core/store/core/configuration';
import { getUserAuthorized } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { LoginModalComponent } from 'ish-shared/components/login/login-modal/login-modal.component';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  private currentDialog: NgbModalRef;
  private isMobile: boolean;

  constructor(private modalService: NgbModal, private router: Router, private store: Store) {
    store.pipe(select(getDeviceType), first()).subscribe(type => (this.isMobile = type === 'mobile'));
  }

  async canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
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
    this.store.pipe(select(getUserAuthorized), whenTruthy(), first()).subscribe(() => {
      this.currentDialog.dismiss();
    });

    return false;
  }
}
