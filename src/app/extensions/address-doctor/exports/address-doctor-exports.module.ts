import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { LazyAddressDoctorComponent } from './lazy-address-doctor/lazy-address-doctor.component';

@NgModule({
  imports: [CommonModule, TranslateModule],
  declarations: [LazyAddressDoctorComponent],
  exports: [LazyAddressDoctorComponent],
})
export class AddressDoctorExportsModule {}
