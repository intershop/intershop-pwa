import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ContentPageTreeData } from 'ish-core/models/content-page-tree/content-page-tree.interface';
import { ContentPageletEntryPointMapper } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.mapper';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';

import { CMSService } from './cms.service';

describe('Cms Service', () => {
  let cmsService: CMSService;
  let apiService: ApiService;
  let cpepMapper: ContentPageletEntryPointMapper;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.encodeResourceId(anything())).thenCall(id => id);
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
            [
              "cms/includes/ID",
              {
                "sendPGID": true,
              },
            ]
          `);

          expect(data).toMatchInlineSnapshot(`
            {
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
  describe('getViewContextContent', () => {
    beforeEach(() => {
      when(cpepMapper.fromData(anything())).thenReturn([{ id: 'vc-ep' } as ContentPageletEntryPoint, []]);
    });

    it('should use default resourceSetId when none is provided', done => {
      when(apiService.get(anything(), anything())).thenReturn(of({}));

      cmsService.getViewContextContent('vc.test', { Product: 'SKU' }).subscribe({
        next: () => {
          const [url] = capture(apiService.get).last();
          expect(url).toEqual('cms/viewcontexts/vc.test@app_sf_base_cm/entrypoint');
        },
        error: fail,
        complete: done,
      });
    });

    it('should use custom resourceSetId when provided', done => {
      when(apiService.get(anything(), anything())).thenReturn(of({}));

      cmsService.getViewContextContent('vc.test', { Product: 'SKU' }, 'custom_cartridge').subscribe({
        next: () => {
          const [url] = capture(apiService.get).last();
          expect(url).toEqual('cms/viewcontexts/vc.test@custom_cartridge/entrypoint');
        },
        error: fail,
        complete: done,
      });
    });

    it('should pass call parameters as HTTP params', done => {
      when(apiService.get(anything(), anything())).thenReturn(of({}));

      cmsService.getViewContextContent('vc.test', { Product: 'SKU', Category: 'CAT' }).subscribe({
        next: () => {
          const options: AvailableOptions = capture(apiService.get).last()[1];
          expect(options.params.toString()).toContain('Product=SKU');
          expect(options.params.toString()).toContain('Category=CAT');
        },
        error: fail,
        complete: done,
      });
    });

    it('should throw error when viewContextId is not given', done => {
      cmsService.getViewContextContent(undefined, {}).subscribe({
        next: fail,
        error: err => {
          expect(err.message).toContain('getViewContextContent() called without a viewContextId');
          done();
        },
      });

      verify(apiService.get(anything(), anything())).never();
    });
  });
});
