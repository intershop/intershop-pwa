import { NgModule, provideZoneChangeDetection } from '@angular/core';

// must be the first AppModule import so zone stability is tracked before other module constructors run
@NgModule({ providers: [provideZoneChangeDetection()] })
export class ZoneChangeDetectionModule {}
