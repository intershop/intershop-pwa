import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { SharedModule } from '../../../shared/shared.module';
import { QuotingSharedModule } from '../../shared/quoting-shared.module';

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
  imports: [QuotingSharedModule, RouterModule.forChild(quoteRequestEditPageRoutes), SharedModule],
})
export class QuoteRequestEditPageModule {}
