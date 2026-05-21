import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchBoxComponent } from 'ish-shared/components/search/search-box/search-box.component';
import { SharedModule } from 'ish-shared/shared.module';

import { SearchNoResultComponent } from './search-no-result/search-no-result.component';
import { SearchPageComponent } from './search-page.component';
import { SearchResultComponent } from './search-result/search-result.component';

const searchPageRoutes: Routes = [
  {
    path: ':searchTerm',
    component: SearchPageComponent,
    data: {
      breadcrumbData: [{ key: 'search.breadcrumbs.your_search.label' }],
    },
  },
];

@NgModule({
  declarations: [SearchNoResultComponent, SearchPageComponent, SearchResultComponent],
  imports: [RouterModule.forChild(searchPageRoutes), SearchBoxComponent, SharedModule],
})
export class SearchPageModule {}
