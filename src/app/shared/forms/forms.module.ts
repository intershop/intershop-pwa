import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'src/libs/shared/ui/icon/icon.module';

import { DirectivesModule } from 'ish-core/directives.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

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
})
export class FormsSharedModule {}
