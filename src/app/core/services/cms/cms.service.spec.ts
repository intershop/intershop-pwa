import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ContentPageTreeData } from 'ish-core/models/content-page-tree/content-page-tree.interface';
import { ContentPageletEntryPointMapper } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.mapper';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';

import { CMSService } from './cms.service';

describe('Cms Service', () => {
  let cmsService: CMSService;
  let apiService: ApiService;
  let cpepMapper: ContentPageletEntryPointMapper;

  beforeEach(() => {
    apiService = mock(ApiService);
    cpepMapper = mock(ContentPageletEntryPointMapper);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: ContentPageletEntryPointMapper, useFactory: () => instance(cpepMapper) },
      ],
    });

    cmsService = TestBed.inject(CMSService);
  });

  it('should be created', () => {
    expect(cmsService).toBeTruthy();
  });

  describe('getContentInclude', () => {
    it('should call api service to retrieve content include', done => {
      when(apiService.get(anything(), anything())).thenReturn(of('My Data'));
      when(cpepMapper.fromData(anything())).thenReturn([undefined, undefined]);

      cmsService.getContentInclude('ID').subscribe({
        next: data => {
          verify(apiService.get(anything(), anything())).once();

          const args = capture(apiService.get).first();
          expect(args).toMatchInlineSnapshot(`
            Array [
              "cms/includes/ID",
              Object {
                "sendPGID": true,
              },
            ]
          `);

          expect(data).toMatchInlineSnapshot(`
            Object {
              "include": undefined,
              "pagelets": undefined,
            }
          `);
        },
        error: fail,
        complete: done,
      });
    });
  });

  describe('getContentPageTree', () => {
    beforeEach(() => {
      when(apiService.get(`cms/pagetree/dummyId`, anything())).thenReturn(
        of({ page: { itemId: 'dummyId' } } as ContentPageTreeData)
      );
    });

    it('should call ApiService "PageTree" when used', () => {
      cmsService.getContentPageTree('dummyId');
      verify(apiService.get(`cms/pagetree/dummyId`, anything())).once();
    });

    it('should set depth when property is set to 2', () => {
      cmsService.getContentPageTree('dummyId', 2);
      verify(apiService.get(`cms/pagetree/dummyId`, anything())).once();

      expect(capture(apiService.get).last()[0].toString()).toMatchInlineSnapshot(`"cms/pagetree/dummyId"`);
      const options: AvailableOptions = capture(apiService.get).last()[1];
      expect(options.params.toString()).toMatchInlineSnapshot(`"depth=2"`);
    });

    it('should set depth when property is set to 0', () => {
      cmsService.getContentPageTree('dummyId', 0);
      verify(apiService.get(`cms/pagetree/dummyId`, anything())).once();

      expect(capture(apiService.get).last()[0].toString()).toMatchInlineSnapshot(`"cms/pagetree/dummyId"`);
      const options: AvailableOptions = capture(apiService.get).last()[1];
      expect(options.params.toString()).toMatchInlineSnapshot(`"depth=0"`);
    });

    it('should throw error when contentPageId is not set', done => {
      cmsService.getContentPageTree(undefined).subscribe({
        next: fail,
        error: err => {
          expect(err).toBeTruthy();
          done();
        },
      });

      verify(apiService.get(anything())).never();
    });
  });
});
