import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ExternalTranslateLoader } from './external-translate-loader';

describe('External Translate Loader', () => {
  let http: HttpClient;
  let loader: ExternalTranslateLoader;

  describe('with standard format', () => {
    beforeEach(() => {
      http = mock(HttpClient);
      when(http.get(anything())).thenReturn(of({}));

      loader = new ExternalTranslateLoader(instance(http), 'http://example.com');
    });

    it('should be created', () => {
      expect(http).toBeTruthy();
      expect(loader).toBeTruthy();
    });

    it.each<string | jest.DoneCallback>(['en_US', 'en-us', 'EN-US'])(
      'should load translations for %s',
      (lang: string, done: jest.DoneCallback) => {
        loader.getTranslation(lang).subscribe(() => {
          verify(http.get(anything())).once();
          const [query] = capture(http.get).last();
          expect(query).toEqual('http://example.com/en_US.json');

          done();
        });
      }
    );
  });

  describe('with special format', () => {
    beforeEach(() => {
      http = mock(HttpClient);
      when(http.get(anything())).thenReturn(of({}));

      loader = new ExternalTranslateLoader(instance(http), 'http://example.com', '$language-$country-$theme');
    });

    it('should be created', () => {
      expect(http).toBeTruthy();
      expect(loader).toBeTruthy();
    });

    it.each<string | jest.DoneCallback>(['en_US', 'en-us', 'EN-US'])(
      'should load translations for %s',
      (lang: string, done: jest.DoneCallback) => {
        loader.getTranslation(lang).subscribe(() => {
          verify(http.get(anything())).once();
          const [query] = capture(http.get).last();
          expect(query).toEqual('http://example.com/en-us-default');

          done();
        });
      }
    );
  });
});
