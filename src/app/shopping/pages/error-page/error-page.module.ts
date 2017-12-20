import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ErrorPageComponent } from './error-page.component';
import { errorPageRoutes } from './error-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(errorPageRoutes),
    SharedModule
  ],
  declarations: [
    ErrorPageComponent
  ]
})

export class ErrorPageModule { }
