import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'quote-debug',
    loadChildren: () => import('./quote-debug/quote-debug-page.module').then(m => m.QuoteDebugPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Quoting2RoutingModule {}
