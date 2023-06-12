import { APP_BASE_HREF } from '@angular/common';
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
      providers: [
        { provide: APP_BASE_HREF, useValue: '/de' },
        provideMockStore({ selectors: [{ selector: getMultiSiteLocaleMap, value: multiSiteLocaleMap }] }),
      ],
    });
    multiSiteService = TestBed.inject(MultiSiteService);
  });

  it('should be created', () => {
    expect(multiSiteService).toBeTruthy();
  });
  it('should return url unchanged if no language baseHref exists', done => {
    multiSiteService.getLangUpdatedUrl('de_DE', '/testpath').subscribe(url => {
      expect(url).toMatchInlineSnapshot(`"/testpath"`);
      done();
    });
  });
  it('should return with new url if language baseHref exists and language is valid', done => {
    multiSiteService.getLangUpdatedUrl('en_US', '/de/testpath').subscribe(url => {
      expect(url).toMatchInlineSnapshot(`"/en/testpath"`);
      done();
    });
  });
  it('should return url unchanged if language baseHref exists but language is invalid', done => {
    multiSiteService.getLangUpdatedUrl('xy_XY', '/de/testpath').subscribe(url => {
      expect(url).toMatchInlineSnapshot(`"/de/testpath"`);
      done();
    });
  });

  it.each([
    [undefined, undefined, 'undefined'],
    ['/test', undefined, '/test'],
    ['/test', {}, '/test'],
    ['/test', { foo: 'bar' }, '/test;foo=bar'],
    ['/test', { foo: 'bar', marco: 'polo' }, '/test;foo=bar;marco=polo'],
    ['/test?query=q', undefined, '/test?query=q'],
    ['/test?query=q', {}, '/test?query=q'],
    ['/test?query=q', { foo: 'bar' }, '/test;foo=bar?query=q'],
    ['/test?query=q', { foo: 'bar', marco: 'polo' }, '/test;foo=bar;marco=polo?query=q'],
  ])(`should transform "%s" with %j to "%s"`, (url, params, expected) => {
    const splittedUrl = url?.split('?');
    expect(multiSiteService.appendUrlParams(splittedUrl?.[0], params, splittedUrl?.[1])).toBe(expected);
  });
});
