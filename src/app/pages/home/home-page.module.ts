import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { HomePageContainerComponent } from './home-page.container';

const homePageRoutes: Routes = [
  { path: '', component: HomePageContainerComponent, data: { wrapperClass: 'homepage' } },
];

@NgModule({
  imports: [RouterModule.forChild(homePageRoutes), SharedModule],
  declarations: [HomePageContainerComponent],
})
export class HomePageModule {}
