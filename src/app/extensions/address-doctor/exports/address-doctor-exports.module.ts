import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyAddressDoctorComponent } from './lazy-address-doctor/lazy-address-doctor.component';

@NgModule({
  imports: [CommonModule, FeatureToggleModule, TranslateModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'addressDoctor',
        location: () => import('../store/address-doctor-store.module').then(m => m.AddressDoctorStoreModule),
      },
      multi: true,
    },
  ],
  declarations: [LazyAddressDoctorComponent],
  exports: [LazyAddressDoctorComponent],
})
export class AddressDoctorExportsModule {}
