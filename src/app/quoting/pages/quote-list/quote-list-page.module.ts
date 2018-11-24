import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { SharedModule } from '../../../shared/shared.module';
import { QuotingSharedModule } from '../../shared/quoting-shared.module';

import { QuoteListComponent } from './components/quote-list/quote-list.component';
import { QuoteListPageContainerComponent } from './quote-list-page.container';

const quoteListPageRoutes: Routes = [
  {
    path: '',
    component: QuoteListPageContainerComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'quoting' },
  },
];

@NgModule({
  declarations: [QuoteListComponent, QuoteListPageContainerComponent],
  imports: [QuotingSharedModule, RouterModule.forChild(quoteListPageRoutes), SharedModule],
})
export class QuoteListPageModule {}
