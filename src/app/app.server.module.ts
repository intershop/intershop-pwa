import { Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { Routes } from '@angular/router';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { LocalizeRouterLoader } from './services/router-parser-loader';
import { LocalizeRouterSettings } from './services/routes-parser-locale-currency/localize-router.config';

export class TranslateUniversalLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      const file = join(process.cwd(), 'dist', 'server', 'assets', 'i18n', `${lang}.json`);
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
    ModuleMapLoaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory
      }
    })
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppServerModule {
}
