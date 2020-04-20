import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';
import { instance, mock } from 'ts-mockito';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { LogoutUser } from 'ish-core/store/user';

import { ResetPagelets } from './pagelets.actions';
import { PageletsEffects } from './pagelets.effects';

describe('Pagelets Effects', () => {
  let actions$: Observable<Action>;
  let effects: PageletsEffects;
  let cmsServiceMock: CMSService;

  beforeEach(() => {
    cmsServiceMock = mock(CMSService);

    TestBed.configureTestingModule({
      providers: [
        PageletsEffects,
        provideMockActions(() => actions$),
        { provide: CMSService, useFactory: () => instance(cmsServiceMock) },
      ],
    });
    effects = TestBed.get(PageletsEffects);
  });

  describe('resetPageletsAfterLogout$', () => {
    it('should map to action of type ResetPagelets if LogoutUser action triggered', () => {
      const action = new LogoutUser();
      const completion = new ResetPagelets();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.resetPageletsAfterLogout$).toBeObservable(expected$);
    });
  });
});
