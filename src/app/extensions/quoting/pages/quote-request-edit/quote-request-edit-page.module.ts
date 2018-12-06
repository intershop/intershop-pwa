import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { QuotingModule } from '../../quoting.module';

import { QuoteRequestEditPageContainerComponent } from './quote-request-edit-page.container';

const quoteRequestEditPageRoutes: Routes = [
  {
    path: ':quoteRequestId',
    component: QuoteRequestEditPageContainerComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'quoting' },
  },
];

@NgModule({
  declarations: [QuoteRequestEditPageContainerComponent],
  imports: [QuotingModule, RouterModule.forChild(quoteRequestEditPageRoutes)],
})
export class QuoteRequestEditPageModule {}
