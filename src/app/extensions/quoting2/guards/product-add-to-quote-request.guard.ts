import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { ProductAddToQuoteDialogComponent } from '../shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { addProductToQuoteRequest } from '../store/quoting';

@Injectable({ providedIn: 'root' })
export class ProductAddToQuoteRequestGuard implements CanActivate {
  constructor(private modalService: NgbModal, private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.store.dispatch(
      addProductToQuoteRequest({ sku: route.queryParamMap.get('sku'), quantity: +route.queryParamMap.get('quantity') })
    );

    this.modalService.open(ProductAddToQuoteDialogComponent, { centered: true, size: 'lg' });

    return false;
  }
}
