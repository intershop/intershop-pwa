import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { QuotingModule } from '../../quoting.module';

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
  imports: [QuotingModule, RouterModule.forChild(quoteEditPageRoutes)],
})
export class QuoteEditPageModule {}
