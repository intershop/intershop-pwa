import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { Locale } from 'ish-core/models/locale/locale.model';
import { getCurrentLocale, getICMStaticURL } from 'ish-core/store/core/configuration';

import { ContentConfigurationParameterData } from './content-configuration-parameter.interface';
import { ContentConfigurationParameterMapper } from './content-configuration-parameter.mapper';

describe('Content Configuration Parameter Mapper', () => {
  let contentConfigurationParameterMapper: ContentConfigurationParameterMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            { selector: getICMStaticURL, value: 'http://www.example.org/static/channel/-' },
            { selector: getCurrentLocale, value: { lang: 'de_DE' } as Locale },
          ],
        }),
      ],
    });

    contentConfigurationParameterMapper = TestBed.inject(ContentConfigurationParameterMapper);
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
    it.each([
      ['assets/pwa/pwa_home_teaser_1.jpg', 'assets/pwa/pwa_home_teaser_1.jpg', 'Image'],
      [
        'site:/pwa/pwa_home_teaser_1.jpg',
        'http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg',
        'Image',
      ],
      [
        'site:/pwa/pwa_home_teaser_1.jpg',
        'http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg',
        'ImageXS',
      ],
      ['site:/pwa/pwa_home_teaser_1.jpg', 'site:/pwa/pwa_home_teaser_1.jpg', 'Other'],
      ['site:/video/video.mp4', 'http://www.example.org/static/channel/-/site/de_DE/video/video.mp4', 'Video'],
      ['https://www.youtube.com/watch?v=ABCDEFG', 'https://www.youtube.com/watch?v=ABCDEFG', 'Video'],
    ])(`should transform %s to %s for key %s`, (input, expected, key) => {
      expect(contentConfigurationParameterMapper.postProcessFileReferences({ [key]: input })).toEqual({
        [key]: expected,
      });
    });
  });
});
