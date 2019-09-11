import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ErrorPageComponent } from './components/error-page/error-page.component';
import { ServerErrorPageComponent } from './components/server-error-page/server-error-page.component';
import { ErrorPageContainerComponent } from './error-page.container';

const errorPageRoutes: Routes = [
  { path: '', component: ErrorPageContainerComponent, data: { wrapperClass: 'errorpage', headerType: 'simple' } },
];

@NgModule({
  imports: [RouterModule.forChild(errorPageRoutes), SharedModule],
  declarations: [ErrorPageComponent, ErrorPageContainerComponent, ServerErrorPageComponent],
})
export class ErrorPageModule {}
