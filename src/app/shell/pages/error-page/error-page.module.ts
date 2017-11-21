import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ErrorPageComponent } from './error-page.component';
import { ErrorPageRoute } from './error-page.routes';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ErrorPageRoute),
  ],
  declarations: [ErrorPageComponent],
  providers: []
})

export class ErrorPageModule {

}
