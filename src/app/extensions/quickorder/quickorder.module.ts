import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { DirectOrderComponent } from './shared/direct-order/direct-order.component';
import { HeaderQuickorderComponent } from './shared/header-quickorder/header-quickorder.component';

@NgModule({
  imports: [SharedModule],
  declarations: [DirectOrderComponent, HeaderQuickorderComponent],
  exports: [SharedModule],
})
export class QuickorderModule {}
