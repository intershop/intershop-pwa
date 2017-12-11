import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ICM_APPLICATION_SK, ICM_BASE_URL_SK, ICM_SERVER_SK, StatePropertiesService } from './core/services/state-transfer/state-properties.service';
import { UniversalMockInterceptor } from './mocking/interceptors/universal-mock.interceptor';

export class TranslateUniversalLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
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
    ServerModule,
    ServerTransferStateModule,
    ModuleMapLoaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: UniversalMockInterceptor, multi: true },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppServerModule {

  constructor(
    transferState: TransferState,
    statePropertiesService: StatePropertiesService
  ) {
    transferState.set(ICM_BASE_URL_SK, statePropertiesService.getICMBaseURL());
    transferState.set(ICM_APPLICATION_SK, statePropertiesService.getICMApplication());
    transferState.set(ICM_SERVER_SK, statePropertiesService.getICMServer());
  }
}
