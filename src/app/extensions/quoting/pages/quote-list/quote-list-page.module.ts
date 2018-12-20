import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { QuotingModule } from '../../quoting.module';

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
  imports: [QuotingModule, RouterModule.forChild(quoteListPageRoutes)],
})
export class QuoteListPageModule {}
