import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { SearchNoResultComponent } from './search-no-result/search-no-result.component';
import { SearchPageComponent } from './search-page.component';
import { SearchResultComponent } from './search-result/search-result.component';

const searchPageRoutes: Routes = [
  {
    path: ':searchTerm',
    component: SearchPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(searchPageRoutes), SharedModule],
  declarations: [SearchNoResultComponent, SearchPageComponent, SearchResultComponent],
})
export class SearchPageModule {}
