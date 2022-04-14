import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DirectivesModule } from 'ish-core/directives.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';

import { FormControlFeedbackComponent } from './components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from './directives/show-form-feedback.directive';

const exportedComponents = [FormControlFeedbackComponent, ShowFormFeedbackDirective];

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    FeatureToggleModule,
    IconModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [...exportedComponents],
  exports: [...exportedComponents],
})
export class FormsSharedModule {}
