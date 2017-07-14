import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router';
import {familyPageRoute} from './familyPage.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FamilyPageComponent} from './familyPage.component';
import {CategoryListComponent} from '../../shared/components/categoryList/categoryList.component';
import {CategoryComponent} from '../../shared/components/category/category.component';
import {FamilyPageListComponent} from './familyPageList/familyPageList.component';
import {BreadcrumbComponent} from '../../shared/components/breadCrumb/breadCrumb.component';
import {ProductTileComponent} from '../../shared/components/productTile/productTile.component';
import {ProductListService} from './familyPageList/productListService/ProductList.service';
import {ProductListMockService} from './familyPageList/productListService/ProductList.service.mock';
import {ProductListApiService} from './familyPageList/productListService/ProductList.service.api';
import {InstanceService} from '../../shared/services/instance.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(familyPageRoute),
    FormsModule,
    ReactiveFormsModule

  ],
  declarations: [FamilyPageComponent,
    CategoryListComponent,
    CategoryComponent, FamilyPageListComponent,
    BreadcrumbComponent, ProductTileComponent],
  providers: [ProductListService, ProductListMockService, ProductListApiService, InstanceService]
})

export class FamilyPageModule {

}
