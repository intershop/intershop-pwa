import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { DirectOrderComponent } from './shared/direct-order/direct-order.component';
import { QuickorderLinkComponent } from './shared/quickorder-link/quickorder-link.component';

@NgModule({
  imports: [SharedModule],
  declarations: [DirectOrderComponent, QuickorderLinkComponent],
  exports: [SharedModule],
})
export class QuickorderModule {}
