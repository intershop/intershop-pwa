import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { HeaderQuickorderComponent } from './shared/header-quickorder/header-quickorder.component';

@NgModule({
  imports: [SharedModule],
  declarations: [HeaderQuickorderComponent],
  exports: [SharedModule],
})
export class QuickorderModule {}
