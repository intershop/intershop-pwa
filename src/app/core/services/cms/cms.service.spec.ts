import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ContentPageletEntryPointMapper } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.mapper';
import { ApiService } from 'ish-core/services/api/api.service';

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
        { provide: ContentPageletEntryPointMapper, useFactory: () => instance(cpepMapper) },
        { provide: ApiService, useFactory: () => instance(apiService) },
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
      // tslint:disable-next-line: no-any
      when(cpepMapper.fromData(anything())).thenReturn({} as any);

      cmsService.getContentInclude('ID').subscribe(
        data => {
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
        fail,
        done
      );
    });
  });
});
