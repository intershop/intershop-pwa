import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from './error-page.component';
import { RouterModule } from '@angular/router';
import { errorPageRoute } from './error-page.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(errorPageRoute),
  ],
  declarations: [ErrorPageComponent],
  providers: []
})

export class ErrorPageModule {

}
