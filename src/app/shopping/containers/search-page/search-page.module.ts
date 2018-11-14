import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { SearchNoResultComponent } from '../../components/search/search-no-result/search-no-result.component';
import { SearchResultComponent } from '../../components/search/search-result/search-result.component';
import { ShoppingSharedModule } from '../../shopping-shared.module';

import { SearchPageContainerComponent } from './search-page.container';
import { searchPageRoutes } from './search-page.routes';

@NgModule({
  imports: [RouterModule.forChild(searchPageRoutes), SharedModule, ShoppingSharedModule],
  declarations: [SearchNoResultComponent, SearchPageContainerComponent, SearchResultComponent],
})
export class SearchPageModule {}
