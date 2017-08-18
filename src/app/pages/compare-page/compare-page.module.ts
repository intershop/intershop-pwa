import { NgModule } from '@angular/core';
import { ComparePageComponent } from './compare-page.component';
import { RouterModule } from '@angular/router';
import { ComparePageRoute } from './compare-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(ComparePageRoute)
  ],
  declarations: [ComparePageComponent]
})
export class ComparePageModule { }
