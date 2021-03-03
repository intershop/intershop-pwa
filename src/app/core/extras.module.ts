import { NgModule } from '@angular/core';

import { SentryExportsModule } from '../extensions/sentry/exports/sentry-exports.module';
import { SeoModule } from '../extensions/seo/seo.module';
import { TrackingExportsModule } from '../extensions/tracking/exports/tracking-exports.module';

@NgModule({
  // tslint:disable:ng-module-sorted-fields
  imports: [
    // tracking with https://tagmanager.google.com
    TrackingExportsModule,
    // browser error tracking with https://sentry.io
    SentryExportsModule,
    // ngx-meta integration https://www.npmjs.com/package/@ngx-meta/core
    SeoModule,
  ],
})
export class ExtrasModule {}
