import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FEATURE_TOGGLE_IMPORTS } from 'ish-core/feature-toggle';

import { FormControlFeedbackComponent } from './components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from './directives/show-form-feedback.directive';

const exportedComponents = [FormControlFeedbackComponent, ShowFormFeedbackDirective];

export const FORMS_SHARED_IMPORTS = [
  CommonModule,
  ...FEATURE_TOGGLE_IMPORTS,
  FormControlFeedbackComponent,
  ReactiveFormsModule,
  RouterModule,
  ShowFormFeedbackDirective,
] as const;

export const FORMS_SHARED_EXPORTS = [...exportedComponents] as const;
