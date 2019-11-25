import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Action, Store } from '@ngrx/store';
import { anything, capture, spy, verify } from 'ts-mockito';

import { UserActionTypes } from 'ish-core/store/user';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { LogoutGuard } from './logout.guard';

describe('Logout Guard', () => {
  describe('canActivate()', () => {
    let logoutGuard: LogoutGuard;
    let store$: Store<{}>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, ngrxTesting()],
      }).compileComponents();

      store$ = spy(TestBed.get(Store));
    }));

    beforeEach(() => {
      logoutGuard = TestBed.get(LogoutGuard);
    });

    it('should log out when called', () => {
      logoutGuard.canActivate();
      verify(store$.dispatch(anything())).called();

      const [arg] = capture(store$.dispatch).last();
      expect((arg as Action).type).toBe(UserActionTypes.LogoutUser);
    });

    it('should redirect to /home when called', () => {
      const tree = logoutGuard.canActivate();

      expect(tree.toString()).toMatchInlineSnapshot(`"/home"`);
    });
  });
});
