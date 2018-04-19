import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedSearchModule } from '../../../shared/shared-search.module';
import { SharedModule } from '../../../shared/shared.module';
import { SearchNoResultComponent } from '../../components/search/search-no-result/search-no-result.component';
import { SearchResultComponent } from '../../components/search/search-result/search-result.component';
import { ProductsService } from '../../services/products/products.service';
import { ShoppingSharedModule } from '../../shopping-shared.module';
import { SearchPageContainerComponent } from './search-page.container';
import { searchPageRoutes } from './search-page.routes';

@NgModule({
  imports: [RouterModule.forChild(searchPageRoutes), SharedModule, ShoppingSharedModule, SharedSearchModule],
  providers: [ProductsService],
  declarations: [SearchPageContainerComponent, SearchResultComponent, SearchNoResultComponent],
})
export class SearchPageModule {}
