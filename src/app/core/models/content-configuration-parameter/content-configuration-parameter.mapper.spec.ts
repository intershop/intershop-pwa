import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

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
            { selector: getCurrentLocale, value: 'de_DE' },
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
        type: 'set-id:types.pagelet2-name',
      },
      key2: {
        definitionQualifiedName: 'name2',
        value: 'hello',
        type: 'set-id:types.pagelet2-name',
      },
      key3: {
        definitionQualifiedName: 'name3',
        value: ['hello', 'world'],
        type: 'set-id:types.pagelet2-name',
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

  it('should handle bc_pmc:types.pagelet2-ImageFileRef', () => {
    const input: { [name: string]: ContentConfigurationParameterData } = {
      key1: {
        definitionQualifiedName: 'name1',
        value: 'assets/pwa/pwa_home_teaser_1.jpg',
        type: 'bc_pmc:types.pagelet2-ImageFileRef',
      },
      key2: {
        definitionQualifiedName: 'name2',
        value: 'site:/pwa/pwa_home_teaser_1.jpg',
        type: 'bc_pmc:types.pagelet2-ImageFileRef',
      },
      key3: {
        definitionQualifiedName: 'name3',
        value: 'http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg',
        type: 'bc_pmc:types.pagelet2-ImageFileRef',
      },
      key4: {
        definitionQualifiedName: 'name4',
        value: 'https://www.youtube.com/watch?v=ABCDEFG',
        type: 'bc_pmc:types.pagelet2-ImageFileRef',
      },
      key5: {
        definitionQualifiedName: 'name5',
        value: [
          'assets/pwa/pwa_home_teaser_1.jpg',
          'site:/pwa/pwa_home_teaser_1.jpg',
          'http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg',
          'https://www.youtube.com/watch?v=ABCDEFG',
        ],
        type: 'bc_pmc:types.pagelet2-ImageFileRef',
      },
    };

    const result = contentConfigurationParameterMapper.fromData(input);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "key1": "assets/pwa/pwa_home_teaser_1.jpg",
        "key2": "http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg",
        "key3": "http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg",
        "key4": "https://www.youtube.com/watch?v=ABCDEFG",
        "key5": Array [
          "assets/pwa/pwa_home_teaser_1.jpg",
          "http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg",
          "http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg",
          "https://www.youtube.com/watch?v=ABCDEFG",
        ],
      }
    `);
  });

  it('should handle bc_pmc:types.pagelet2-FileRef', () => {
    const input: { [name: string]: ContentConfigurationParameterData } = {
      key1: {
        definitionQualifiedName: 'name1',
        value: 'assets/pwa/pwa_home_teaser_1.jpg',
        type: 'bc_pmc:types.pagelet2-FileRef',
      },
      key2: {
        definitionQualifiedName: 'name2',
        value: 'site:/pwa/pwa_home_teaser_1.jpg',
        type: 'bc_pmc:types.pagelet2-FileRef',
      },
      key3: {
        definitionQualifiedName: 'name3',
        value: 'http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg',
        type: 'bc_pmc:types.pagelet2-FileRef',
      },
      key4: {
        definitionQualifiedName: 'name4',
        value: 'https://www.youtube.com/watch?v=ABCDEFG',
        type: 'bc_pmc:types.pagelet2-FileRef',
      },
      key5: {
        definitionQualifiedName: 'name5',
        value: [
          'assets/pwa/pwa_home_teaser_1.jpg',
          'site:/pwa/pwa_home_teaser_1.jpg',
          'http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg',
          'https://www.youtube.com/watch?v=ABCDEFG',
        ],
        type: 'bc_pmc:types.pagelet2-FileRef',
      },
    };

    const result = contentConfigurationParameterMapper.fromData(input);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "key1": "assets/pwa/pwa_home_teaser_1.jpg",
        "key2": "http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg",
        "key3": "http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg",
        "key4": "https://www.youtube.com/watch?v=ABCDEFG",
        "key5": Array [
          "assets/pwa/pwa_home_teaser_1.jpg",
          "http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg",
          "http://www.example.org/static/channel/-/site/de_DE/pwa/pwa_home_teaser_1.jpg",
          "https://www.youtube.com/watch?v=ABCDEFG",
        ],
      }
    `);
  });
});
