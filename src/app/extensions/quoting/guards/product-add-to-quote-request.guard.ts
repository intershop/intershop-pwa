import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SelectQuoteRequestModalComponent } from '../shared/select-quote-request-modal/select-quote-request-modal.component';

/**
 * Opens the quote request selection dialog: the user picks an existing "New" quote request or names a new one.
 * Aborts without opening the dialog when the required `sku` query param is missing.
 * A missing or invalid `quantity` query param defaults to 1.
 */
export function productAddToQuoteRequestGuard(route: ActivatedRouteSnapshot): boolean {
  const sku = route.queryParamMap.get('sku')?.trim();

  if (!sku) {
    return false;
  }

  const parsedQuantity = Number(route.queryParamMap.get('quantity'));
  const quantity = Number.isInteger(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;

  const modalService = inject(NgbModal);

  const ref = modalService.open(SelectQuoteRequestModalComponent, {
    ariaLabelledBy: 'select-quote-request-modal-title',
  });
  const component = ref.componentInstance as SelectQuoteRequestModalComponent;
  component.sku = sku;
  component.quantity = quantity;
  component.modalRef = ref;

  return false;
}
