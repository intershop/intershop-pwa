import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(AppModule)],
}).catch(err => console.error(err));
