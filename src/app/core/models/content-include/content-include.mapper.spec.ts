import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { ContentIncludeData } from './content-include.interface';
import { ContentIncludeMapper } from './content-include.mapper';

describe('Content Include Mapper', () => {
  let contentIncludeMapper: ContentIncludeMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
    });
    contentIncludeMapper = TestBed.get(ContentIncludeMapper);
  });

  it('should throw on falsy input', () => {
    expect(() => contentIncludeMapper.fromData(undefined)).toThrowError('falsy input');
  });

  it('should convert a complex example to complex type', () => {
    const input: ContentIncludeData = {
      link: {
        title: 'include-id',
        uri: 'uri://test',
        type: 'ContentInclude',
      },
      definitionQualifiedName: 'fq',
      displayName: 'name-include',
      pagelets: [
        {
          id: 'pagelet1',
          definitionQualifiedName: 'fq',
          displayName: 'name1',
          configurationParameters: {
            key1: {
              definitionQualifiedName: 'fq',
              value: 'hallo 1',
            },
          },
          slots: {
            slot1: {
              definitionQualifiedName: 'fq',
              pagelets: [
                {
                  id: 'pagelet11',
                  definitionQualifiedName: 'fq',
                  displayName: 'name11',
                  configurationParameters: {
                    key11: {
                      definitionQualifiedName: 'fq',
                      value: 'test',
                    },
                  },
                },
              ],
            },
          },
        },
        {
          id: 'pagelet2',
          definitionQualifiedName: 'fq',
          displayName: 'name2',
        },
      ],
    };

    const result = contentIncludeMapper.fromData(input);

    expect(result.pagelets).toHaveLength(3);
    expect(result.pagelets.map(p => p.id)).toIncludeAllMembers(['pagelet1', 'pagelet11', 'pagelet2']);
    expect(result.include).not.toBeEmpty();
    expect(result).toMatchSnapshot();
  });
});
