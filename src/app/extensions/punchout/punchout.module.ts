import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { PunchoutLoginFormComponent } from './shared/punchout-login-form/punchout-login-form.component';
import { PunchoutPasswordFormComponent } from './shared/punchout-password-form/punchout-password-form.component';
import { PunchoutTransferBasketComponent } from './shared/punchout-transfer-basket/punchout-transfer-basket.component';

@NgModule({
  imports: [SharedModule],
  declarations: [PunchoutLoginFormComponent, PunchoutPasswordFormComponent, PunchoutTransferBasketComponent],
  exports: [PunchoutLoginFormComponent, PunchoutPasswordFormComponent, PunchoutTransferBasketComponent, SharedModule],
})
export class PunchoutModule {}
