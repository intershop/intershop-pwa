import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ErrorComponent } from './components/error/error.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { ErrorPageContainerComponent } from './error-page.container';

const errorPageRoutes: Routes = [
  { path: '', component: ErrorPageContainerComponent, data: { wrapperClass: 'errorpage', headerType: 'simple' } },
];

@NgModule({
  imports: [RouterModule.forChild(errorPageRoutes), SharedModule],
  declarations: [ErrorComponent, ErrorPageContainerComponent, ServerErrorComponent],
})
export class ErrorPageModule {}
