import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { ContentEntryPointData } from './content-entry-point.interface';
import { ContentEntryPointMapper } from './content-entry-point.mapper';

describe('Content Entry Point Mapper', () => {
  let contentEntryPointMapper: ContentEntryPointMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
    });
    contentEntryPointMapper = TestBed.get(ContentEntryPointMapper);
  });

  it('should throw on falsy input', () => {
    expect(() => contentEntryPointMapper.fromData(undefined)).toThrowError('falsy input');
  });

  it('should convert a complex example to complex type', () => {
    const input: ContentEntryPointData = {
      link: {
        title: 'include-id',
        uri: 'uri://test',
        type: 'ContentInclude',
      },
      definitionQualifiedName: 'fq',
      displayName: 'name-include',
      id: 'include-id',
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

    const result = contentEntryPointMapper.fromData(input);

    expect(result.pagelets).toHaveLength(3);
    expect(result.pagelets.map(p => p.id)).toIncludeAllMembers(['pagelet1', 'pagelet11', 'pagelet2']);
    expect(result.contentEntryPoint).not.toBeEmpty();
    expect(result).toMatchSnapshot();
  });
});
