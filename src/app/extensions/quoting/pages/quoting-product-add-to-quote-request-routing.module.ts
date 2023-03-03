import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { productAddToQuoteRequestGuard } from '../guards/product-add-to-quote-request.guard';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', children: [], canActivate: [productAddToQuoteRequestGuard] }])],
})
export class QuotingProductAddToQuoteRequestRoutingModule {}
