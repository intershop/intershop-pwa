import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { coBrowsePageGuard } from './co-browse-page.guard';

const coBrowsePageRoutes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [coBrowsePageGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(coBrowsePageRoutes)],
})
export class CoBrowsePageModule {}
