import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MetaService } from '@ngx-meta/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { SetSeoAttributes } from './seo.actions';
import { SeoEffects } from './seo.effects';

describe('Seo Effects', () => {
  let actions$: Observable<Action>;
  let effects: SeoEffects;
  let metaServiceMock: MetaService;

  beforeEach(() => {
    metaServiceMock = mock(MetaService);
    when(metaServiceMock.setTitle(anyString())).thenReturn();

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        SeoEffects,
        provideMockActions(() => actions$),
        { provide: MetaService, useFactory: () => instance(metaServiceMock) },
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(SeoEffects);
  });

  describe('setMetaData$', () => {
    it('should call the metaService to setup meta data', done => {
      const action = new SetSeoAttributes({
        title: 'dummy',
        description: 'dummy desc',
        robots: 'index, follow',
        'og:other': 'other data',
      });
      actions$ = of(action);

      effects.setMetaData$.subscribe(() => {
        verify(metaServiceMock.setTitle('dummy')).once();
        verify(metaServiceMock.setTag('robots', 'index, follow')).once();
        verify(metaServiceMock.setTag('description', 'dummy desc')).once();
        verify(metaServiceMock.setTag('og:other', 'other data')).once();
        done();
      });
    });
  });
});
