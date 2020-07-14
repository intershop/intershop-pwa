import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CompanySwitchComponent } from './shared/structure/company-switch/company-switch.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CompanySwitchComponent],
  exports: [CompanySwitchComponent, SharedModule],
})
export class CompanyStructureModule {}
