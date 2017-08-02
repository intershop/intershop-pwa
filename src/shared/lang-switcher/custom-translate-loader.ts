import {en} from '../../assets/i18n/en';
import { de } from '../../assets/i18n/de';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

export class CustomTranslateLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return Observable.create(observer => {
      if (lang === 'de') {
        observer.next(de);
      } else {
        observer.next(en);
      }
      observer.complete();
    });
  }
}
