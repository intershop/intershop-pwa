import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MetaService } from '@ngx-meta/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as seoActions from './seo.actions';
import { SeoEffects } from './seo.effects';

describe('Seo Effects', () => {
  let actions$: Observable<Action>;
  let effects: SeoEffects;
  let metaServiceMock: MetaService;

  beforeEach(() => {
    metaServiceMock = mock(MetaService);
    when(metaServiceMock.setTitle(anyString())).thenReturn();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ngrxTesting({ reducers: coreReducers })],
      providers: [
        SeoEffects,
        provideMockActions(() => actions$),
        { provide: MetaService, useFactory: () => instance(metaServiceMock) },
      ],
    });

    effects = TestBed.get(SeoEffects);
  });

  describe('setMetaData$', () => {
    it('should call the metaService to setup meta data', done => {
      const action = new seoActions.SetSeoAttributes({
        metaTitle: 'dummy',
        metaDescription: 'dummy desc',
        robots: ['index', 'follow'],
      });
      actions$ = of(action);

      effects.setMetaData$.subscribe(() => {
        verify(metaServiceMock.setTitle('dummy')).once();
        verify(metaServiceMock.setTag('robots', 'index,follow')).once();
        verify(metaServiceMock.setTag('description', 'dummy desc')).once();
        done();
      });
    });
  });
});
