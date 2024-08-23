import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./return-overview/return-overview-page.module').then(m => m.ReturnOverviewPageModule),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./return-request-detail/return-request-detail-page.module').then(m => m.ReturnRequestDetailPageModule),
    data: { breadcrumbData: [{ key: 'Returns details' }] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnRequestRoutingModule {}
