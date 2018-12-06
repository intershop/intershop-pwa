import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { StoreModule } from '@ngrx/store';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Observable, Observer } from 'rxjs';

import { UniversalMockInterceptor } from 'ish-core/interceptors/universal-mock.interceptor';
import { coreReducers } from 'ish-core/store/core-store.module';
import {
  ICM_APPLICATION_SK,
  ICM_BASE_URL_SK,
  ICM_SERVER_SK,
  StatePropertiesService,
} from 'ish-core/utils/state-transfer/state-properties.service';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

export class TranslateUniversalLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      let rootPath = process.cwd();
      if (!!rootPath && rootPath.indexOf('browser') > 0) {
        rootPath = process.cwd().split('browser')[0];
      }
      const file = join(rootPath, 'browser', 'assets', 'i18n', `${lang}.json`);
      if (!existsSync(file)) {
        const errString = `Localization file '${file}' not found!`;
        console.error(errString);
        observer.error(errString);
      } else {
        const content = JSON.parse(readFileSync(file, 'utf8'));
        observer.next(content);
        observer.complete();
      }
    });
  }
}

export function translateLoaderFactory() {
  return new TranslateUniversalLoader();
}

@NgModule({
  imports: [
    AppModule,
    ModuleMapLoaderModule,
    ServerModule,
    ServerTransferStateModule,
    StoreModule.forRoot(coreReducers, {}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
      },
    }),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: UniversalMockInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppServerModule {
  constructor(transferState: TransferState, statePropertiesService: StatePropertiesService) {
    transferState.set(ICM_BASE_URL_SK, statePropertiesService.getICMBaseURL());
    transferState.set(ICM_APPLICATION_SK, statePropertiesService.getICMApplication());
    transferState.set(ICM_SERVER_SK, statePropertiesService.getICMServer());
  }
}
