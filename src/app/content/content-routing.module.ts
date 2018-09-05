import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'page', loadChildren: './containers/content-page/content-page.module#ContentPageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ContentRoutingModule {}
