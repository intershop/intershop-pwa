import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { memoize } from 'lodash-es';
import { shareReplay } from 'rxjs/operators';

export class ExternalTranslateLoader extends TranslateHttpLoader {
  static DEFAULT_FORMAT = '$language_$COUNTRY.json';

  constructor(http: HttpClient, url: string, private format: string = ExternalTranslateLoader.DEFAULT_FORMAT) {
    super(http, !url.endsWith('/') ? `${url}/` : url, '');
  }

  private retrieveTranslation = memoize(lang => super.getTranslation(lang).pipe(shareReplay(1)));

  private interpolate = memoize((lang: string) => {
    const [language, country] = lang.split(/[^a-zA-Z0-9]/g);

    return this.format
      .replace('$language', language?.toLowerCase())
      .replace('$LANGUAGE', language?.toUpperCase())
      .replace('$country', country?.toLowerCase())
      .replace('$COUNTRY', country?.toUpperCase())
      .replace('$theme', THEME.toLowerCase())
      .replace('$THEME', THEME.toUpperCase());
  });

  getTranslation(lang: string) {
    return this.retrieveTranslation(this.interpolate(lang));
  }
}
