import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { RecentlyPageComponent } from './recently-page.component';
import { RecentlyViewedAllComponent } from './recently-viewed-all/recently-viewed-all.component';

const recentlyPageRoutes: Routes = [{ path: '', component: RecentlyPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(recentlyPageRoutes), SharedModule],
  declarations: [RecentlyPageComponent, RecentlyViewedAllComponent],
})
export class RecentlyPageModule {}
