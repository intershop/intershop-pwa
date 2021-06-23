import { LocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { MultiSiteService } from 'ish-core/utils/multi-site/multi-site.service';

import { MakeHrefPipe } from './make-href.pipe';

describe('Make Href Pipe', () => {
  let makeHrefPipe: MakeHrefPipe;
  let multiSiteService: MultiSiteService;

  beforeEach(() => {
    multiSiteService = mock(MultiSiteService);
    TestBed.configureTestingModule({
      providers: [MakeHrefPipe, { provide: MultiSiteService, useFactory: () => instance(multiSiteService) }],
    });
    makeHrefPipe = TestBed.inject(MakeHrefPipe);
    when(multiSiteService.getLangUpdatedUrl(anything(), anything(), anything())).thenCall(
      (url: string, _: LocationStrategy) => url
    );
  });

  it('should be created', () => {
    expect(makeHrefPipe).toBeTruthy();
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
    expect(makeHrefPipe.transform({ path: () => url, getBaseHref: () => '/' } as LocationStrategy, params)).toEqual(
      expected
    );
  });

  it('should call the multiSiteService if lang parameter exists', () => {
    makeHrefPipe.transform({ path: () => '/de/test', getBaseHref: () => '/de' } as LocationStrategy, { lang: 'en_US' });
    verify(multiSiteService.getLangUpdatedUrl(anything(), anything(), anything())).once();
  });
});
