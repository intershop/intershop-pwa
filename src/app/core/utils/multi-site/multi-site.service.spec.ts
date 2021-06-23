import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { MultiSiteService } from './multi-site.service';

describe('Multi Site Service', () => {
  let multiSiteService: MultiSiteService;
  let statePropertiesService: StatePropertiesService;

  beforeEach(() => {
    statePropertiesService = mock(StatePropertiesService);
    TestBed.configureTestingModule({
      providers: [{ provide: StatePropertiesService, useFactory: () => instance(statePropertiesService) }],
    });
    multiSiteService = TestBed.inject(MultiSiteService);

    when(statePropertiesService.getStateOrEnvOrDefault(anything(), anything())).thenReturn(
      of({
        en_US: '/en',
        de_DE: '/de',
        fr_FR: '/fr',
      })
    );
  });

  it('should be created', () => {
    expect(multiSiteService).toBeTruthy();
  });
  it('should return url unchanged if no language baseHref exists', done => {
    multiSiteService.getLangUpdatedUrl('de_DE', '/testpath', '/').subscribe(url => {
      expect(url).toMatchInlineSnapshot(`"/testpath"`);
      done();
    });
  });
  it('should return with new url if language baseHref exists and language is valid', done => {
    multiSiteService.getLangUpdatedUrl('en_US', '/de/testpath', '/de').subscribe(url => {
      expect(url).toMatchInlineSnapshot(`"/en/testpath"`);
      done();
    });
  });
  it('should return url unchanged if language baseHref exists but language is invalid', done => {
    multiSiteService.getLangUpdatedUrl('xy_XY', '/de/testpath', '/de').subscribe(url => {
      expect(url).toMatchInlineSnapshot(`"/de/testpath"`);
      done();
    });
  });
});
