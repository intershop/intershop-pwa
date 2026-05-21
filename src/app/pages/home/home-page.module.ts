import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { HomePageComponent } from './home-page.component';

const homePageRoutes: Routes = [{ path: '', component: HomePageComponent, data: { wrapperClass: 'homepage' } }];

@NgModule({
  declarations: [HomePageComponent],
  imports: [RouterModule.forChild(homePageRoutes), SharedModule],
})
export class HomePageModule {}
