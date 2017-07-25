import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { familyPageRoute } from './familyPage.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FamilyPageComponent } from './familyPage.component';
import { FilterListComponent } from '../../shared/components/filterList/filterList.component';
import { CategoryComponent } from '../../shared/components/category/category.component';
import { FamilyPageListComponent } from './familyPageList/familyPageList.component';
import { BreadcrumbComponent } from '../../shared/components/breadCrumb/breadCrumb.component';
import { ProductTileComponent } from '../../shared/components/productTile/productTile.component';
import { ProductListService, ProductListApiService, ProductListMockService } from './familyPageList/productListService';
import { SharedModule } from '../../shared/sharedModules/shared.module';
import { CategoryService, CategoryApiService, CategoryMockService } from '../../shared/components/filterList/filterListService';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(familyPageRoute),
    FormsModule,
    ReactiveFormsModule,
    SharedModule

  ],
  declarations: [
    FamilyPageComponent,
    FilterListComponent,
    CategoryComponent,
    FamilyPageListComponent,
    BreadcrumbComponent,
    ProductTileComponent
  ],
  providers: [
    ProductListService,
    ProductListMockService,
    ProductListApiService,
    CategoryService,
    CategoryApiService,
    CategoryMockService

  ]
})

export class FamilyPageModule {

}
