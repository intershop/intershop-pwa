import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { RequisitionRejectDialogComponent } from './requisition-reject-dialog.component';

@NgModule({
  declarations: [RequisitionRejectDialogComponent],
  imports: [CommonModule, NgbModule, ReactiveFormsModule, FormlyModule.forRoot(), TranslateModule],
  exports: [RequisitionRejectDialogComponent],
})
export class RequisitionRejectDialogModule {}
