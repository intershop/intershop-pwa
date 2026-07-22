import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { productAddToQuoteRequestGuard } from '../guards/product-add-to-quote-request.guard';
import { QuotingModule } from '../quoting.module';

@NgModule({
  imports: [
    QuotingModule,
    RouterModule.forChild([{ path: '', children: [], canActivate: [productAddToQuoteRequestGuard] }]),
  ],
})
export class QuotingProductAddToQuoteRequestRoutingModule {}
