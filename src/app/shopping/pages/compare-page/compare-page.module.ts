import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComparePageComponent } from './compare-page.component';
import { comparePageRoutes } from './compare-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(comparePageRoutes),
    CommonModule
  ],
  declarations: [ComparePageComponent]
})
export class ComparePageModule { }
