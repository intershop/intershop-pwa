import { ContentPageletData } from './content-pagelet.interface';
import { ContentPageletMapper } from './content-pagelet.mapper';

describe('Content Pagelet Mapper', () => {
  it('should throw on empty input', () => {
    expect(() => ContentPageletMapper.fromData(undefined)).toThrowError('falsy input');
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

    const result = ContentPageletMapper.fromData(input);
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

    const result = ContentPageletMapper.fromData(input);
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

    const result = ContentPageletMapper.fromData(input);

    expect(result).toHaveLength(4);
    expect(result.map(p => p.id)).toIncludeAllMembers([
      'pagelet',
      'pagelet-nested',
      'pagelet-nested2',
      'pagelet-deeply-nested',
    ]);
    expect(result).toMatchSnapshot();
  });
});
