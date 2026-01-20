import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';

import { productAddToQuoteRequestGuard } from '../guards/product-add-to-quote-request.guard';
import { QuotingStoreModule } from '../store/quoting-store.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        canActivate: [productAddToQuoteRequestGuard],
        loadComponent: () =>
          import('../shared/product-add-to-quote-dialog/product-add-to-quote-dialog.component').then(
            c => c.ProductAddToQuoteDialogComponent
          ),
        providers: [importProvidersFrom(QuotingStoreModule)],
      },
    ]),
  ],
})
export class QuotingProductAddToQuoteRequestRoutingModule {}
