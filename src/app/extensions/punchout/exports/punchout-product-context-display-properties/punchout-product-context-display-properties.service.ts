import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMapTo } from 'rxjs/operators';

import {
  ExternalDisplayPropertiesProvider,
  ProductContextDisplayProperties,
} from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { RoleToggleService } from 'ish-core/role-toggle.module';

@Injectable({ providedIn: 'root' })
export class PunchoutProductContextDisplayPropertiesService implements ExternalDisplayPropertiesProvider {
  constructor(private roleToggleService: RoleToggleService) {}

  setup(product$: Observable<ProductView>): Observable<Partial<ProductContextDisplayProperties<false>>> {
    return product$.pipe(
      switchMapTo(this.roleToggleService.hasRole(['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'])),
      map(isPunchoutUser =>
        isPunchoutUser
          ? {
              addToQuote: false,
              shipment: false,
            }
          : {}
      )
    );
  }
}
