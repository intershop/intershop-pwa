import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

const fs = require('fs');

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

@NgModule({
  imports: [
    ServerModule,
    AppModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateUniversalLoader
      }
    }),
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppServerModule {
}
