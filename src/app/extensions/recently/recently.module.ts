import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { RecentlyViewedComponent } from './shared/recently-viewed/recently-viewed.component';

@NgModule({
  imports: [SharedModule],
  declarations: [RecentlyViewedComponent],
  exports: [SharedModule],
})
export class RecentlyModule {}
