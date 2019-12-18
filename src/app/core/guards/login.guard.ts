import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { filter, first } from 'rxjs/operators';

import { getUserAuthorized } from 'ish-core/store/user';
import { getDeviceType } from 'ish-core/store/viewconf';
import { whenTruthy } from 'ish-core/utils/operators';
import { LazyLoginModalComponent } from 'ish-shell/header/lazy-login-modal/lazy-login-modal.component';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  private currentDialog: NgbModalRef<typeof LazyLoginModalComponent>;
  private isMobile: boolean;

  constructor(private modalService: NgbModal, private router: Router, private store: Store<{}>) {
    store
      .pipe(
        select(getDeviceType),
        first()
      )
      .subscribe(type => (this.isMobile = type === 'mobile'));
  }

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
    // first request should go to page
    if (!this.router.navigated) {
      return true;
    }

    // mobile view should not use modal
    if (this.isMobile) {
      return true;
    }

    const returnUrl = route.queryParams.returnUrl || '/home';

    this.currentDialog = this.modalService.open(LazyLoginModalComponent, { centered: true, size: 'sm' });
    this.currentDialog.componentInstance.loginMessageKey = route.queryParamMap.get('messageKey');

    // dialog closed
    this.currentDialog.componentInstance.close.pipe(first()).subscribe(() => {
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
    this.store
      .pipe(
        select(getUserAuthorized),
        whenTruthy(),
        first()
      )
      .subscribe(() => {
        this.currentDialog.dismiss();
        this.router.navigateByUrl(returnUrl);
      });

    return false;
  }
}
