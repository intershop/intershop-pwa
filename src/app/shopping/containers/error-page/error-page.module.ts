import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ErrorPageComponent } from '../../components/error/error-page/error-page.component';
import { ServerErrorPageComponent } from '../../components/error/server-error-page/server-error-page.component';
import { ErrorPageContainerComponent } from './error-page.container';
import { errorPageRoutes } from './error-page.routes';

@NgModule({
  imports: [RouterModule.forChild(errorPageRoutes), SharedModule],
  declarations: [ErrorPageComponent, ErrorPageContainerComponent, ServerErrorPageComponent],
})
export class ErrorPageModule {}
