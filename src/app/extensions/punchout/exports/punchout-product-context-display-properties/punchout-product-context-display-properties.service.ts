import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  ExternalDisplayPropertiesProvider,
  ProductContext,
  ProductContextDisplayProperties,
} from 'ish-core/facades/product-context.facade';
import { RoleToggleService } from 'ish-core/role-toggle.module';

@Injectable({ providedIn: 'root' })
export class PunchoutProductContextDisplayPropertiesService implements ExternalDisplayPropertiesProvider {
  constructor(private roleToggleService: RoleToggleService) {}

  setup(
    context$: Observable<Pick<ProductContext, 'product' | 'prices'>>
  ): Observable<Partial<ProductContextDisplayProperties<false>>> {
    return context$.pipe(
      switchMap(() => this.roleToggleService.hasRole(['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER'])),
      map(isPunchoutUser =>
        isPunchoutUser
          ? {
              addToQuote: false,
              addToNotification: false,
              shipment: false,
            }
          : {}
      )
    );
  }
}
