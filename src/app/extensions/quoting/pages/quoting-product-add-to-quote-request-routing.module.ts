import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProductAddToQuoteRequestGuard } from '../guards/product-add-to-quote-request.guard';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', children: [], canActivate: [ProductAddToQuoteRequestGuard] }])],
  providers: [ProductAddToQuoteRequestGuard],
})
export class QuotingProductAddToQuoteRequestRoutingModule {}
