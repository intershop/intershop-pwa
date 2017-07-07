import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "app/shared/components/breadcrumb/breadcrumb.component";
import { FamilyPageComponent } from "app/pages/familyPage/familyPage.component";
import { familyPageRoute } from "app/pages/familyPage/familyPage.routes";
import { FamilyPageListComponent } from "app/pages/familyPage/familyPageList/familyPageList.component";
import { ProductTileComponent } from "app/shared/components/productTile/productTile.component";
import { CategoryComponent } from "app/shared/components/category/category.component";
import { CategoryListComponent } from "app/shared/components/categoryList/categoryList.component";
import { ProductListFilterComponent } from "app/pages/familyPage/productListFilter/productListFilter.component";


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(familyPageRoute),
        FormsModule,
        ReactiveFormsModule

    ],
    declarations: [FamilyPageComponent,
        ProductListFilterComponent, CategoryListComponent, CategoryComponent, FamilyPageListComponent, BreadcrumbComponent, ProductTileComponent],
    providers: []
})

export class FamilyPageModule {

}
