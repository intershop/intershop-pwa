import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FamilyPageModule } from '../family-page/family-page.module';
import { CategoryPageComponent } from './category-page.component';
import { CategoryPageRoute } from './category-page.routes';
import { DeciderComponent } from './decider.component';

@NgModule({
  imports: [
    CommonModule,
    FamilyPageModule,
    RouterModule.forChild(CategoryPageRoute)
  ],
  declarations: [CategoryPageComponent, DeciderComponent]
})

export class CategoryPageModule {

}
