import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';

import { RequisitionContextFacade } from '../../facades/requisition-context.facade';
import { RequisitionRejectDialogModule } from '../requisition-reject-dialog/requisition-reject-dialog.module';

import { RequisitionsListComponent } from './requisitions-list.component';

@NgModule({
  declarations: [RequisitionsListComponent],
  imports: [
    CdkTableModule,
    CommonModule,
    FormlyModule.forRoot(),
    IconModule,
    TranslateModule.forChild(),
    NgbModule,
    PipesModule,
    ReactiveFormsModule,
    RequisitionRejectDialogModule,
    RouterModule,
  ],
  exports: [RequisitionsListComponent],
  providers: [RequisitionContextFacade],
})
export class RequisitionsListModule {}
