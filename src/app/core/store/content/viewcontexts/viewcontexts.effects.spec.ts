import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { CMSService } from 'ish-core/services/cms/cms.service';

import { loadViewContextEntrypoint, loadViewContextEntrypointSuccess } from './viewcontexts.actions';
import { ViewcontextsEffects } from './viewcontexts.effects';

describe('Viewcontexts Effects', () => {
  let actions$: Observable<Action>;
  let effects: ViewcontextsEffects;
  let cmsServiceMock: CMSService;

  beforeEach(() => {
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      providers: [
        ViewcontextsEffects,
        provideMockActions(() => actions$),
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
      ],
    });

    effects = TestBed.inject(ViewcontextsEffects);
  });

  describe('loadViewContextEntrypoint$', () => {
    it('should not dispatch actions when encountering loadViewcontexts', () => {
      when(cmsServiceMock.getViewContextContent(anything(), anything(), anything())).thenReturn(
        of({ entrypoint: { id: 'test' } as ContentPageletEntryPoint, pagelets: [] })
      );

      actions$ = hot('-a-a-a', {
        a: loadViewContextEntrypoint({
          viewcontextId: 'test',
          callParameters: {},
          clientId: 'test-id',
        }),
      });
      const expected$ = cold('-c-c-c', {
        c: loadViewContextEntrypointSuccess({
          entrypoint: { id: 'test' } as ContentPageletEntryPoint,
          pagelets: [],
        }),
      });

      expect(effects.loadViewContextEntrypoint$).toBeObservable(expected$);
    });
  });
});
