import { NgModule } from '@angular/core';

import { SentryModule } from '../extensions/sentry/sentry.module';
import { TrackingModule } from '../extensions/tracking/tracking.module';

/*
 * declaration of optional modules, comment out to deactivate
 */
// tslint:disable:ng-module-sorted-fields
const importExportModules = [
  // tracking with https://tagmanager.google.com
  TrackingModule,
  // browser error tracking with https://sentry.io
  SentryModule,
];

@NgModule({
  imports: [...importExportModules],
  exports: [...importExportModules],
})
export class ExtrasModule {}
