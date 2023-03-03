import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { filter, first } from 'rxjs/operators';

import { getDeviceType } from 'ish-core/store/core/configuration';
import { getUserAuthorized } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { LoginModalComponent } from 'ish-shared/components/login/login-modal/login-modal.component';

/**
 * The guard decides whether to show the login dialog, used as alternative for the login page
 */

export async function loginGuard(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
  const modalService = inject(NgbModal);
  const router = inject(Router);
  const store = inject(Store);

  let isMobile: boolean;
  store.pipe(select(getDeviceType), first()).subscribe(type => (isMobile = type === 'mobile'));

  // first request should go to page
  if (!router.navigated) {
    return true;
  }

  // mobile view should not use modal
  if (isMobile) {
    return true;
  }

  // force page view by queryParam
  if (route.queryParams.forcePageView) {
    return true;
  }

  const currentDialog = modalService.open(LoginModalComponent, { centered: true, size: 'sm' });

  const loginModalComponent = currentDialog.componentInstance as LoginModalComponent;
  loginModalComponent.loginMessageKey = route.queryParamMap.get('messageKey');
  loginModalComponent.detectChanges();

  // dialog closed
  loginModalComponent.closeModal.pipe(first()).subscribe(() => {
    currentDialog.dismiss();
  });

  // navigated away with link on dialog
  router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      first()
    )
    .subscribe(() => {
      currentDialog.dismiss();
    });

  // login successful
  store.pipe(select(getUserAuthorized), whenTruthy(), first()).subscribe(() => {
    currentDialog.dismiss();
  });

  return false;
}
