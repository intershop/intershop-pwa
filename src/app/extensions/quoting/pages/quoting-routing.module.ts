import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'quote-list',
    loadChildren: './quote-list/quote-list-page.module#QuoteListPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'quote',
    loadChildren: './quote-edit/quote-edit-page.module#QuoteEditPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'quote-request',
    loadChildren: './quote-request-edit/quote-request-edit-page.module#QuoteRequestEditPageModule',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotingRoutingModule {}
