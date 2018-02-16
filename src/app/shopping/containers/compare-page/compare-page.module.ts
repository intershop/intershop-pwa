import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComparePageContainerComponent } from './compare-page.container';
import { comparePageRoutes } from './compare-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(comparePageRoutes),
    CommonModule
  ],
  declarations: [
    ComparePageContainerComponent
  ]
})

export class ComparePageModule { }
