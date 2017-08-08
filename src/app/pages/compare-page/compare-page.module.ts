import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparePageComponent } from './compare-page.component';
import { RouterModule } from '@angular/router';
import { ComparePageRoute } from './compare-page.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComparePageRoute),
  ],
  declarations: [ComparePageComponent]
})
export class ComparePageModule { }
