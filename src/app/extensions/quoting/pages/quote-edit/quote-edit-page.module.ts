import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { SharedModule } from '../../../../shared/shared.module';
import { QuotingSharedModule } from '../../shared/quoting-shared.module';

import { QuoteEditPageContainerComponent } from './quote-edit-page.container';

const quoteEditPageRoutes: Routes = [
  {
    path: ':quoteId',
    component: QuoteEditPageContainerComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'quoting' },
  },
];

@NgModule({
  declarations: [QuoteEditPageContainerComponent],
  imports: [QuotingSharedModule, RouterModule.forChild(quoteEditPageRoutes), SharedModule],
})
export class QuoteEditPageModule {}
