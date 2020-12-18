import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { PunchoutLoginFormComponent } from './shared/punchout-login-form/punchout-login-form.component';
import { PunchoutPasswordFormComponent } from './shared/punchout-password-form/punchout-password-form.component';

@NgModule({
  imports: [SharedModule],
  declarations: [PunchoutLoginFormComponent, PunchoutPasswordFormComponent],
  exports: [PunchoutLoginFormComponent, PunchoutPasswordFormComponent, SharedModule],
})
export class PunchoutModule {}
