import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify } from 'ts-mockito';

import { getDeviceType } from 'ish-core/store/core/configuration';
import { isStickyHeader } from 'ish-core/store/core/viewconf';

import { displaySuccessMessage } from './messages.actions';
import { MessagesEffects } from './messages.effects';

describe('Messages Effects', () => {
  let actions$: Observable<Action>;
  let effects: MessagesEffects;
  let toastrServiceMock: ToastrService;

  beforeEach(() => {
    toastrServiceMock = mock(ToastrService);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        MessagesEffects,
        provideMockActions(() => actions$),
        { provide: ToastrService, useFactory: () => instance(toastrServiceMock) },
        provideMockStore({
          selectors: [
            { selector: isStickyHeader, value: false },
            { selector: getDeviceType, value: 'desktop' },
          ],
        }),
      ],
    });

    effects = TestBed.inject(MessagesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should call ToastrService when handling messages', done => {
    actions$ = of(displaySuccessMessage({ message: 'test' }));

    effects.successToast$.subscribe(() => {
      verify(toastrServiceMock.success(anything(), anything(), anything())).once();
      done();
    });
  });
});
