import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryPageComponent } from './category-page.component';
import { RouterModule } from '@angular/router';
import { CategoryPageRoute } from './category-page.routes';
import { FamilyPageModule } from '../family-page/family-page.module';
import { DeciderComponent } from './decider.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CategoryPageRoute),
    FamilyPageModule
  ],
  declarations: [CategoryPageComponent, DeciderComponent]
})

export class CategoryPageModule {

}
