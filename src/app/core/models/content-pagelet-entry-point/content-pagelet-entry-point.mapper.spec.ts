import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { ContentPageletEntryPointData } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.interface';
import { ContentPageletEntryPointMapper } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.mapper';

describe('Content Pagelet Entry Point Mapper', () => {
  let contentPageletEntryPointMapper: ContentPageletEntryPointMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    contentPageletEntryPointMapper = TestBed.inject(ContentPageletEntryPointMapper);
  });

  it('should throw on falsy input', () => {
    expect(() => contentPageletEntryPointMapper.fromData(undefined)).toThrowError('falsy input');
  });

  it('should convert a complex example to complex type', () => {
    const input: ContentPageletEntryPointData = {
      link: {
        title: 'Readable Title',
        uri: 'uri://test',
        type: 'ContentInclude',
      },
      id: 'include-id',
      domain: 'the-domain',
      resourceSetId: 'resource-set-id',
      definitionQualifiedName: 'fq',
      displayName: 'name-include',
      pagelets: [
        {
          id: 'pagelet1',
          definitionQualifiedName: 'fq',
          domain: 'domain',
          displayName: 'name1',
          configurationParameters: {
            key1: {
              definitionQualifiedName: 'fq',
              value: 'hallo 1',
            },
          },
          slots: {
            slot1: {
              displayName: 'slot1',
              definitionQualifiedName: 'fq',
              pagelets: [
                {
                  id: 'pagelet11',
                  definitionQualifiedName: 'fq',
                  domain: 'Domain',
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
          domain: 'domain',
          displayName: 'name2',
        },
      ],
    };

    const [pageletEntryPoint, pagelets] = contentPageletEntryPointMapper.fromData(input);

    expect(pagelets).toHaveLength(3);
    expect(pagelets.map(p => p.id)).toIncludeAllMembers(['pagelet1', 'pagelet11', 'pagelet2']);
    expect(pageletEntryPoint).not.toBeEmpty();
    expect(pageletEntryPoint).toMatchInlineSnapshot(`
      Object {
        "configurationParameters": Object {},
        "definitionQualifiedName": "fq",
        "displayName": "name-include",
        "domain": "the-domain",
        "id": "include-id",
        "pageletIDs": Array [
          "pagelet1",
          "pagelet2",
        ],
        "resourceSetId": "resource-set-id",
      }
    `);
  });
});
