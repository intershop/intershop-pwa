import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getICMStaticURL } from 'ish-core/store/core/configuration';

import { ContentPageletData } from './content-pagelet.interface';
import { ContentPageletMapper } from './content-pagelet.mapper';

describe('Content Pagelet Mapper', () => {
  let contentPageletMapper: ContentPageletMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [{ selector: getICMStaticURL, value: 'http://www.example.org/static/channel/-' }],
        }),
      ],
    });

    contentPageletMapper = TestBed.inject(ContentPageletMapper);
  });

  it('should throw on empty input', () => {
    expect(() => contentPageletMapper.fromData(undefined)).toThrowError('falsy input');
  });

  it('should convert simple pagelet to single array instance', () => {
    const input: ContentPageletData = {
      id: 'pagelet',
      displayName: 'pagelet',
      domain: 'domain',
      definitionQualifiedName: 'domain-pagelet',
      configurationParameters: {
        key: {
          definitionQualifiedName: 'quali',
          value: 'test',
        },
      },
    };

    const result = contentPageletMapper.fromData(input);
    expect(result).toMatchSnapshot();
  });

  it('should convert pagelet with slots to single array instance', () => {
    const input: ContentPageletData = {
      id: 'pagelet',
      displayName: 'pagelet',
      domain: 'domain',
      definitionQualifiedName: 'domain-pagelet',
      configurationParameters: {
        key: {
          definitionQualifiedName: 'quali',
          value: 'test',
        },
      },
      slots: {
        slot1: {
          displayName: 'Slot',
          definitionQualifiedName: 'quali-slot',
          pagelets: [],
        },
      },
    };

    const result = contentPageletMapper.fromData(input);
    expect(result).toMatchSnapshot();
  });

  it('should convert pagelet with slots and additional pagelets to multi array instance', () => {
    const input: ContentPageletData = {
      id: 'pagelet',
      displayName: 'pagelet',
      domain: 'domain',
      definitionQualifiedName: 'domain-pagelet',
      configurationParameters: {
        key: {
          definitionQualifiedName: 'quali',
          value: 'test',
        },
      },
      slots: {
        slot1: {
          displayName: 'slot1',
          definitionQualifiedName: 'quali-slot',
          pagelets: [
            {
              id: 'pagelet-nested',
              definitionQualifiedName: 'fq',
              displayName: 'name-nested',
              domain: 'domain',
            },
          ],
        },
        slot2: {
          definitionQualifiedName: 'quali-slot',
          displayName: 'slot2',
          pagelets: [
            {
              id: 'pagelet-nested2',
              definitionQualifiedName: 'domain-pagelet',
              displayName: 'name1',
              domain: 'domain',
              configurationParameters: {
                key1: {
                  definitionQualifiedName: 'fq',
                  value: 'test-key1',
                },
              },
              slots: {
                slot11: {
                  definitionQualifiedName: 'fq-2',
                  displayName: 'slot11',
                  pagelets: [
                    {
                      id: 'pagelet-deeply-nested',
                      definitionQualifiedName: 'fq',
                      displayName: 'name-nested',
                      domain: 'domain',
                      configurationParameters: {
                        key3: {
                          definitionQualifiedName: 'fq',
                          value: '1',
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
          configurationParameters: {
            key1: {
              definitionQualifiedName: 'name1',
              value: 'hallo',
            },
            key2: {
              definitionQualifiedName: 'name2',
              value: ['hallo', 'welt'],
            },
          },
        },
      },
    };

    const result = contentPageletMapper.fromData(input);

    expect(result).toHaveLength(4);
    expect(result.map(p => p.id)).toIncludeAllMembers([
      'pagelet',
      'pagelet-nested',
      'pagelet-nested2',
      'pagelet-deeply-nested',
    ]);
    expect(result).toMatchSnapshot();
  });

  it('should have special handling for image pagelet configuration parmeters', () => {
    const input = {
      definitionQualifiedName: 'app_sf_base_cm:component.common.image.pagelet2-Component',
      displayName: 'Brand Image 5',
      domain: 'domain',
      id: 'cmp_brandImage_5',
      configurationParameters: {
        Image: {
          value: 'inSPIRED-inTRONICS-b2c-responsive:/brands/adata.jpg',
          definitionQualifiedName: 'app_sf_base_cm:component.common.image.pagelet2-Component-Image',
        },
      },
    } as ContentPageletData;

    expect(contentPageletMapper.fromData(input)[0]).toHaveProperty(
      'configurationParameters.Image',
      'http://www.example.org/static/channel/-/inSPIRED-inTRONICS-b2c-responsive/-/brands/adata.jpg'
    );
  });
});
