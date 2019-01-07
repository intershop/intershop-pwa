import { TestBed } from '@angular/core/testing';

import { STATIC_URL } from 'ish-core/utils/state-transfer/factories';

import { ContentPageletData } from './content-pagelet.interface';
import { ContentPageletMapper } from './content-pagelet.mapper';

describe('Content Pagelet Mapper', () => {
  let contentPageletMapper: ContentPageletMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: STATIC_URL, useValue: 'http://www.example.org/static' }],
    });

    contentPageletMapper = TestBed.get(ContentPageletMapper);
  });

  it('should throw on empty input', () => {
    expect(() => contentPageletMapper.fromData(undefined)).toThrowError('falsy input');
  });

  it('should convert simple pagelet to single array instance', () => {
    const input: ContentPageletData = {
      id: 'pagelet',
      displayName: 'pagelet',
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
      definitionQualifiedName: 'domain-pagelet',
      configurationParameters: {
        key: {
          definitionQualifiedName: 'quali',
          value: 'test',
        },
      },
      slots: {
        slot1: {
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
      definitionQualifiedName: 'domain-pagelet',
      configurationParameters: {
        key: {
          definitionQualifiedName: 'quali',
          value: 'test',
        },
      },
      slots: {
        slot1: {
          definitionQualifiedName: 'quali-slot',
          pagelets: [
            {
              id: 'pagelet-nested',
              definitionQualifiedName: 'fq',
              displayName: 'name-nested',
            },
          ],
        },
        slot2: {
          definitionQualifiedName: 'quali-slot',
          pagelets: [
            {
              id: 'pagelet-nested2',
              definitionQualifiedName: 'domain-pagelet',
              displayName: 'name1',
              configurationParameters: {
                key1: {
                  definitionQualifiedName: 'fq',
                  value: 'test-key1',
                },
              },
              slots: {
                slot11: {
                  definitionQualifiedName: 'fq-2',
                  pagelets: [
                    {
                      id: 'pagelet-deeply-nested',
                      definitionQualifiedName: 'fq',
                      displayName: 'name-nested',
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
      definitionQualifiedName: 'app_sf_responsive_cm:component.common.image.pagelet2-Component',
      displayName: 'Brand Image 5',
      id: 'cmp_brandImage_5',
      configurationParameters: {
        Image: {
          value: 'inSPIRED-inTRONICS-b2c-responsive:/brands/adata.jpg',
          definitionQualifiedName: 'app_sf_responsive_cm:component.common.image.pagelet2-Component-Image',
        },
      },
    };

    expect(contentPageletMapper.fromData(input)[0]).toHaveProperty(
      'configurationParameters.Image',
      'http://www.example.org/static/inSPIRED-inTRONICS-b2c-responsive/-/brands/adata.jpg'
    );
  });
});
