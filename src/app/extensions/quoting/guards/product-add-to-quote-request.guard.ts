import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { first, map, tap } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ConfirmDialog } from 'ish-core/utils/confirm-dialog/confirm-dialog';

import { ProductAddToQuoteDialogComponent } from '../shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { addProductToQuoteRequest } from '../store/quoting';

@Injectable()
export class ProductAddToQuoteRequestGuard implements CanActivate {
  constructor(private modalService: NgbModal, private store: Store, private appFacade: AppFacade) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.store.dispatch(
      addProductToQuoteRequest({ sku: route.queryParamMap.get('sku'), quantity: +route.queryParamMap.get('quantity') })
    );

    const beforeDismiss = () =>
      this.appFacade.pageHasChanges$
        .pipe(
          first(),
          map(hasChange =>
            hasChange ? ConfirmDialog.confirm('You have unsaved changes. Do you really want to leave this page?') : true
          ),
          tap(close => {
            if (close) {
              this.appFacade.resetPageHasChanges();
            }
          })
        )
        .toPromise();

    const ref = this.modalService.open(ProductAddToQuoteDialogComponent, { centered: true, size: 'lg', beforeDismiss });
    const component = ref.componentInstance as ProductAddToQuoteDialogComponent;
    component.modalRef = ref;

    return false;
  }
}
