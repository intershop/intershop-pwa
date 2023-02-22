import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Warranty } from 'ish-core/models/warranty/warranty.model';

/**
 * The Warranty Details Component displays a link to a modal dialog
 * This dialog provides information in detail about the specified warranty.
 *
 * @example
 * <ish-warranty-details
 *   [warranty]="warranty"
 * ></ish-warranty-details>
 */
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

  getWarrantyAttribute(attributes: Attribute[], name: string): string {
    return AttributeHelper.getAttributeValueByAttributeName(attributes, name);
  }
}
