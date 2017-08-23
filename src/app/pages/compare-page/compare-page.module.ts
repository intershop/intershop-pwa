import { NgModule } from '@angular/core';
import { ComparePageComponent } from './compare-page.component';
import { RouterModule } from '@angular/router';
import { ComparePageRoute } from './compare-page.routes';
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    RouterModule.forChild(ComparePageRoute),
    CommonModule
  ],
  declarations: [ComparePageComponent]
})
export class ComparePageModule { }
