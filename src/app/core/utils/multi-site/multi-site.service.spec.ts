import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { getMultiSiteLocaleMap } from 'ish-core/store/core/configuration';

import { MultiSiteService } from './multi-site.service';

const multiSiteLocaleMap = {
  en_US: '/en',
  de_DE: '/de',
  fr_FR: '/fr',
};

describe('Multi Site Service', () => {
  let multiSiteService: MultiSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ selectors: [{ selector: getMultiSiteLocaleMap, value: multiSiteLocaleMap }] })],
    });
    multiSiteService = TestBed.inject(MultiSiteService);
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
