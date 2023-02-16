import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Warranty } from 'ish-core/models/warranty/warranty.model';

@Component({
  selector: 'ish-product-warranty-details',
  templateUrl: './product-warranty-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductWarrantyDetailsComponent {
  @Input() warranty: Warranty;

  warrantyDetails$: Observable<Warranty>;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  getWarrantyDetails(): void {
    this.loading$ = this.shoppingFacade.warrantyLoading$;
    this.error$ = this.shoppingFacade.warrantyError$;
    this.warrantyDetails$ = this.shoppingFacade.warrantyById$(this.warranty.id);
  }
}
