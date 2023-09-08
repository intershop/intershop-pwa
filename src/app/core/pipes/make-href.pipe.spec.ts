import { LocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { MultiSiteService } from 'ish-core/utils/multi-site/multi-site.service';

import { MakeHrefPipe } from './make-href.pipe';

describe('Make Href Pipe', () => {
  let makeHrefPipe: MakeHrefPipe;
  let multiSiteService: MultiSiteService;

  beforeEach(() => {
    multiSiteService = mock(MultiSiteService);
    TestBed.configureTestingModule({
      providers: [{ provide: MultiSiteService, useFactory: () => instance(multiSiteService) }, MakeHrefPipe],
    });
    makeHrefPipe = TestBed.inject(MakeHrefPipe);

    when(multiSiteService.getLangUpdatedUrl(anything(), anything())).thenCall((url: string, _: LocationStrategy) =>
      of(url)
    );
    when(multiSiteService.appendUrlParams(anything(), anything(), anything())).thenCall(
      (url: string, _, __: string) => url
    );
  });

  it('should be created', () => {
    expect(makeHrefPipe).toBeTruthy();
  });

  it('should call appendUrlParams from the multiSiteService if no parameter exists', done => {
    makeHrefPipe
      .transform({ path: () => '/de/test', getBaseHref: () => '/de' } as LocationStrategy, undefined)
      .subscribe(() => {
        verify(multiSiteService.appendUrlParams(anything(), anything(), anything())).once();
        done();
      });
  });

  it('should call getLangUpdatedUrl from the multiSiteService if lang parameter exists', done => {
    makeHrefPipe
      .transform({ path: () => '/de/test', getBaseHref: () => '/de' } as LocationStrategy, { lang: 'en_US' })
      .subscribe(() => {
        verify(multiSiteService.getLangUpdatedUrl(anything(), anything())).once();
        done();
      });
  });

  it('should call appendUrlParams from the multiSiteService if other parameter exists', done => {
    makeHrefPipe
      .transform({ path: () => '/de/test', getBaseHref: () => '/de' } as LocationStrategy, { foo: 'bar' })
      .subscribe(() => {
        verify(multiSiteService.appendUrlParams(anything(), anything(), anything())).once();
        done();
      });
  });
});
