import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { RecentlyViewedAllComponent } from '../../components/recently/recently-viewed-all/recently-viewed-all.component';
import { ShoppingSharedModule } from '../../shopping-shared.module';

import { RecentlyPageContainerComponent } from './recently-page.container';
import { recentlyPageRoutes } from './recently-page.routes';

@NgModule({
  imports: [RouterModule.forChild(recentlyPageRoutes), SharedModule, ShoppingSharedModule],
  declarations: [RecentlyPageContainerComponent, RecentlyViewedAllComponent],
})
export class RecentlyPageModule {}
