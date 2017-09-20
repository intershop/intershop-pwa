import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryPageComponent } from './category-page.component';
import { CategoryPageRoute } from './category-page.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CategoryPageRoute)
  ],
  declarations: [CategoryPageComponent]
})

export class CategoryPageModule {

}
