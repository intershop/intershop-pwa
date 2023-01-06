import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { ProductAddToQuoteDialogComponent } from '../shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component';
import { addProductToQuoteRequest } from '../store/quoting';

@Injectable()
export class ProductAddToQuoteRequestGuard implements CanActivate {
  constructor(private modalService: NgbModal, private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    route.queryParamMap.keys
      .filter(key => key.startsWith('sku'))
      .map(key => key.substring(3))
      .forEach(sku => {
        this.store.dispatch(addProductToQuoteRequest({ sku, quantity: +route.queryParamMap.get(`sku${sku}`) }));
      });

    const ref = this.modalService.open(ProductAddToQuoteDialogComponent, { centered: true, size: 'lg' });
    const component = ref.componentInstance as ProductAddToQuoteDialogComponent;
    component.modalRef = ref;

    return false;
  }
}
