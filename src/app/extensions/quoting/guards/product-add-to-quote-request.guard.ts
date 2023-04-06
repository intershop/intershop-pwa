import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { ProductAddToQuoteDialogComponent } from '../shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { addProductToQuoteRequest } from '../store/quoting';

/**
 * Opens a dialog after adding a product to a quote request
 */

export function productAddToQuoteRequestGuard(route: ActivatedRouteSnapshot): boolean {
  const modalService = inject(NgbModal);
  const store = inject(Store);

  store.dispatch(
    addProductToQuoteRequest({ sku: route.queryParamMap.get('sku'), quantity: +route.queryParamMap.get('quantity') })
  );

  const ref = modalService.open(ProductAddToQuoteDialogComponent, { centered: true, size: 'lg' });
  const component = ref.componentInstance as ProductAddToQuoteDialogComponent;
  component.modalRef = ref;

  return false;
}
