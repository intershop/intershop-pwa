import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { HomePageComponent } from './components/home-page/home-page.component';
import { HomePageContainerComponent } from './home-page.container';

const homePageRoutes: Routes = [
  { path: '', component: HomePageContainerComponent, data: { wrapperClass: 'homepage' } },
];

@NgModule({
  imports: [RouterModule.forChild(homePageRoutes), SharedModule],
  declarations: [HomePageComponent, HomePageContainerComponent],
})
export class HomePageModule {}
