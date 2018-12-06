import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { RecentlyViewedAllComponent } from './components/recently-viewed-all/recently-viewed-all.component';
import { RecentlyPageContainerComponent } from './recently-page.container';

const recentlyPageRoutes: Routes = [{ path: '', component: RecentlyPageContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(recentlyPageRoutes), SharedModule],
  declarations: [RecentlyPageContainerComponent, RecentlyViewedAllComponent],
})
export class RecentlyPageModule {}
