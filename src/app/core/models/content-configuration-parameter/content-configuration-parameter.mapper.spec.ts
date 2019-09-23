import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import * as using from 'jasmine-data-provider';

import { Locale } from 'ish-core/models/locale/locale.model';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { SetAvailableLocales } from 'ish-core/store/locale';
import { localeReducer } from 'ish-core/store/locale/locale.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ContentConfigurationParameterData } from './content-configuration-parameter.interface';
import { ContentConfigurationParameterMapper } from './content-configuration-parameter.mapper';

describe('Content Configuration Parameter Mapper', () => {
  let contentConfigurationParameterMapper: ContentConfigurationParameterMapper;
  let store$: Store<{}>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: { configuration: configurationReducer, locale: localeReducer },
          config: {
            initialState: {
              configuration: {
                baseURL: 'http://www.example.org',
                serverStatic: 'static',
                channel: 'channel',
              },
            },
          },
        }),
      ],
    });

    contentConfigurationParameterMapper = TestBed.get(ContentConfigurationParameterMapper);
    store$ = TestBed.get(Store);
  });

  it('should return a value for undefined input', () => {
    const result = contentConfigurationParameterMapper.fromData(undefined);
    expect(result).not.toBeUndefined();
    expect(result).toBeEmpty();
  });

  it('should map to simple dictionary', () => {
    const input: { [name: string]: ContentConfigurationParameterData } = {
      key1: {
        definitionQualifiedName: 'name1',
        value: '1',
      },
      key2: {
        definitionQualifiedName: 'name2',
        value: 'hello',
      },
      key3: {
        definitionQualifiedName: 'name3',
        value: ['hello', 'world'],
      },
    };

    const result = contentConfigurationParameterMapper.fromData(input);
    expect(result).not.toBeEmpty();
    expect(result).toMatchInlineSnapshot(`
      Object {
        "key1": "1",
        "key2": "hello",
        "key3": Array [
          "hello",
          "world",
        ],
      }
    `);
  });

  describe('postProcessFileReferences', () => {
    using(
      [
        {
          key: 'Image',
          input: 'assets/pwa/pwa_home_teaser_1.jpg',
          expected: 'assets/pwa/pwa_home_teaser_1.jpg',
        },
        {
          key: 'Image',
          input: 'site:/pwa/pwa_home_teaser_1.jpg',
          expected: 'http://www.example.org/static/channel/-/site/-/pwa/pwa_home_teaser_1.jpg',
        },
        {
          key: 'ImageXS',
          input: 'site:/pwa/pwa_home_teaser_1.jpg',
          expected: 'http://www.example.org/static/channel/-/site/-/pwa/pwa_home_teaser_1.jpg',
        },
        {
          key: 'Other',
          input: 'site:/pwa/pwa_home_teaser_1.jpg',
          expected: 'site:/pwa/pwa_home_teaser_1.jpg',
        },
        {
          key: 'Video',
          input: 'site:/video/video.mp4',
          expected: 'http://www.example.org/static/channel/-/site/-/video/video.mp4',
        },
        {
          key: 'Video',
          input: 'https://www.youtube.com/watch?v=ABCDEFG',
          expected: 'https://www.youtube.com/watch?v=ABCDEFG',
        },
      ],
      ({ key, input, expected }) => {
        it(`should transform ${input} to ${expected} for key ${key}`, () => {
          expect(contentConfigurationParameterMapper.postProcessFileReferences({ [key]: input })).toEqual({
            [key]: expected,
          });
        });
      }
    );

    it('should include the current locale into the URL if set', () => {
      const locales = [{ lang: 'de_DE' }] as Locale[];
      store$.dispatch(new SetAvailableLocales({ locales }));

      const key = 'Image';
      const input = 'site:/pwa/pwa_home_teaser_1.jpg';
      const expected = 'http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg';

      expect(contentConfigurationParameterMapper.postProcessFileReferences({ [key]: input })).toEqual({
        [key]: expected,
      });
    });
  });
});
