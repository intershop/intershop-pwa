import { Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { HomePageModule } from './pages/home-page/home-page.module';
import { LocalizeRouterLoader } from './services/router-parser-loader';
import { LocalizeRouterSettings } from './services/routes-parser-locale-currency/localize-router.config';
import { LocalizeRouterModule } from './services/routes-parser-locale-currency/localize-router.module';
import { LocalizeParser } from './services/routes-parser-locale-currency/localize-router.parser';

const fs = require('fs');

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

export class TranslateUniversalLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.create(observer => {

      const file = `dist/assets/i18n/${lang}.json`;
      let content = '';

      if (!fs.existsSync(file)) {
        console.log(`Localization file '${file}' not found!`);
      } else {
        content = JSON.parse(fs.readFileSync(file, 'utf8'));
      }

      observer.next(content);

      observer.complete();
    });
  }
}

export function translateLoaderFactory() {
  return new TranslateUniversalLoader();
}

export function localizeLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings) {
  return new LocalizeRouterLoader(translate, location, settings);
}

@NgModule({
  imports: [
    ServerModule,
    AppModule,
    HomePageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory
      }
    }),
    RouterModule.forRoot(routes),
    LocalizeRouterModule.forRoot(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: localizeLoaderFactory,
        deps: [TranslateService, Location, LocalizeRouterSettings]
      }
    }),
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppServerModule {
}
