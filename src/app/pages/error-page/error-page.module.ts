import { NgModule } from '@angular/core';
import { ErrorPageComponent } from './error-page.component';
import { RouterModule } from '@angular/router';
import { ErrorPageRoute } from './error-page.routes';
import { SharedModule } from '../../shared/shared-modules/shared.module';

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
