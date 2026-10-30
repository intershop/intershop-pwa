import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { PunchoutTransferBasketComponent } from './shared/punchout-transfer-basket/punchout-transfer-basket.component';
import { PunchoutUserFormComponent } from './shared/punchout-user-form/punchout-user-form.component';

@NgModule({
  imports: [SharedModule],
  declarations: [PunchoutTransferBasketComponent, PunchoutUserFormComponent],
  exports: [PunchoutTransferBasketComponent, PunchoutUserFormComponent, SharedModule],
})
export class PunchoutModule {}
