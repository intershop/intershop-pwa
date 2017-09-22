import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComparePageComponent } from './compare-page.component';
import { ComparePageRoute } from './compare-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(ComparePageRoute),
    CommonModule
  ],
  declarations: [ComparePageComponent]
})
export class ComparePageModule { }
