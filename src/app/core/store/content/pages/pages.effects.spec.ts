import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { LoadContentPage, LoadContentPageFail } from './pages.actions';
import { PagesEffects } from './pages.effects';

describe('Pages Effects', () => {
  let actions$: Observable<Action>;
  let effects: PagesEffects;
  let cmsServiceMock: CMSService;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([{ path: 'page/:contentPageId', component: DummyComponent }]),
      ],
      providers: [
        PagesEffects,
        provideMockActions(() => actions$),
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
      ],
    });

    effects = TestBed.inject(PagesEffects);
    router = TestBed.inject(Router);
  });

  describe('loadPages$', () => {
    it('should send fail action when loading action via service is unsuccessful', done => {
      when(cmsServiceMock.getContentPage('dummy')).thenReturn(throwError({ message: 'ERROR' }));

      actions$ = of(new LoadContentPage({ contentPageId: 'dummy' }));

      effects.loadContentPage$.subscribe(action => {
        verify(cmsServiceMock.getContentPage('dummy')).once();
        expect(action).toMatchInlineSnapshot(`
          [Content Page API] Load Content Page Fail:
            error: {"message":"ERROR"}
        `);
        done();
      });
    });

    it('should not die when encountering an error', () => {
      when(cmsServiceMock.getContentPage('dummy')).thenReturn(throwError({ message: 'ERROR' }));

      actions$ = hot('a-a-a-a', { a: new LoadContentPage({ contentPageId: 'dummy' }) });

      expect(effects.loadContentPage$).toBeObservable(
        cold('a-a-a-a', { a: new LoadContentPageFail({ error: { message: 'ERROR' } as HttpError }) })
      );
    });
  });

  describe('selectedContentPage$', () => {
    it('should select the route when url parameter is available', done => {
      effects.selectedContentPage$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Content Page] Load Content Page:
            contentPageId: "dummy"
        `);
        done();
      });

      router.navigateByUrl('/page/dummy');
    });
  });
});
