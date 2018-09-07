import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { ContentInclude } from '../../../models/content-include/content-include.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { ContentIncludesService } from '../../services/content-includes/content-includes.service';

import {
  IncludesActionTypes,
  LoadContentInclude,
  LoadContentIncludeFail,
  LoadContentIncludeSuccess,
} from './includes.actions';
import { IncludesEffects } from './includes.effects';

describe('Includes Effects', () => {
  let actions$: Observable<Action>;
  let effects: IncludesEffects;
  let contentIncludesServiceMock: ContentIncludesService;

  beforeEach(() => {
    contentIncludesServiceMock = mock(ContentIncludesService);

    TestBed.configureTestingModule({
      providers: [
        IncludesEffects,
        provideMockActions(() => actions$),
        { provide: ContentIncludesService, useFactory: () => instance(contentIncludesServiceMock) },
      ],
    });
    effects = TestBed.get(IncludesEffects);
  });

  describe('loadContentInclude$', () => {
    it('should send success action when loading action via service is successful', done => {
      when(contentIncludesServiceMock.getContentInclude('dummy')).thenReturn(
        of({ displayName: 'dummy' } as ContentInclude)
      );

      actions$ = of(new LoadContentInclude('dummy'));

      effects.loadContentInclude$.subscribe((action: LoadContentIncludeSuccess) => {
        verify(contentIncludesServiceMock.getContentInclude('dummy')).once();
        expect(action.type).toEqual(IncludesActionTypes.LoadContentIncludeSuccess);
        expect(action.payload).toHaveProperty('displayName', 'dummy');
        done();
      });
    });

    it('should send fail action when loading action via service is unsuccessful', done => {
      when(contentIncludesServiceMock.getContentInclude('dummy')).thenReturn(throwError({ message: 'ERROR' }));

      actions$ = of(new LoadContentInclude('dummy'));

      effects.loadContentInclude$.subscribe((action: LoadContentIncludeSuccess) => {
        verify(contentIncludesServiceMock.getContentInclude('dummy')).once();
        expect(action.type).toEqual(IncludesActionTypes.LoadContentIncludeFail);
        expect(action.payload).toHaveProperty('message', 'ERROR');
        done();
      });
    });

    it('should not die when encountering an error', () => {
      when(contentIncludesServiceMock.getContentInclude('dummy')).thenReturn(throwError({ message: 'ERROR' }));

      actions$ = hot('a-a-a-a', { a: new LoadContentInclude('dummy') });

      expect(effects.loadContentInclude$).toBeObservable(
        cold('a-a-a-a', { a: new LoadContentIncludeFail({ message: 'ERROR' } as HttpError) })
      );
    });
  });
});
