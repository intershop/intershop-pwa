import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { SearchNoResultComponent } from './components/search-no-result/search-no-result.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchPageContainerComponent } from './search-page.container';

const searchPageRoutes: Routes = [
  {
    path: ':searchTerm',
    component: SearchPageContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(searchPageRoutes), SharedModule],
  declarations: [SearchNoResultComponent, SearchPageContainerComponent, SearchResultComponent],
})
export class SearchPageModule {}
