import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ErrorPageContainerComponent } from './error-page.container';
import { errorPageRoutes } from './error-page.routes';

@NgModule({
  imports: [
    RouterModule.forChild(errorPageRoutes),
    SharedModule
  ],
  declarations: [
    ErrorPageContainerComponent
  ]
})

export class ErrorPageModule { }
