import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SearchBoxComponent } from 'ish-core/standalone/component/suggest/search-box/search-box.component';
import { SharedModule } from 'ish-shared/shared.module';

import { ErrorPageComponent } from './error-page.component';
import { ErrorComponent } from './error/error.component';
import { ServerErrorComponent } from './server-error/server-error.component';

const errorPageRoutes: Routes = [
  { path: '', component: ErrorPageComponent, data: { wrapperClass: 'errorpage', headerType: 'error' } },
];

@NgModule({
  imports: [RouterModule.forChild(errorPageRoutes), SearchBoxComponent, SharedModule],
  declarations: [ErrorComponent, ErrorPageComponent, ServerErrorComponent],
})
export class ErrorPageModule {}
