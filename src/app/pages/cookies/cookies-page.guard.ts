import { inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, first } from 'rxjs/operators';

import { CookiesModalComponent } from './cookies-modal/cookies-modal.component';

/**
 * In case of CSR the cookie consent dialog is shown
 */

export async function cookiesPageGuard() {
  const modalService = inject(NgbModal);
  const router = inject(Router);

  if (SSR) {
    return router.parseUrl('/loading');
  }

  const currentDialog = modalService.open(CookiesModalComponent, {
    centered: true,
    size: 'lg',
    backdrop: 'static',
  });

  const cookiesModalComponent = currentDialog.componentInstance as CookiesModalComponent;

  // dialog closed
  cookiesModalComponent.closeModal.pipe(first()).subscribe(() => {
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

  return false;
}
