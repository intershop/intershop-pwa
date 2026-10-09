import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

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
      imports: [TranslatePipe],
      providers: [
        { provide: ToastrService, useFactory: () => instance(toastrServiceMock) },
        MessagesEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            { selector: isStickyHeader, value: false },
            { selector: getDeviceType, value: 'desktop' },
          ],
        }),
        provideTranslateService(),
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

  it('should render messages as HTML by default', done => {
    actions$ = of(displaySuccessMessage({ message: 'test' }));

    effects.successToast$.subscribe(() => {
      const [, , options] = capture<string, string, Partial<IndividualConfig>>(toastrServiceMock.success).last();
      expect(options.enableHtml).toBeTrue();
      done();
    });
  });

  it('should render messages as text if HTML is disabled', done => {
    actions$ = of(displaySuccessMessage({ message: '<img src=x onerror="alert(1)">', enableHtml: false }));

    effects.successToast$.subscribe(() => {
      const [message, , options] = capture<string, string, Partial<IndividualConfig>>(toastrServiceMock.success).last();
      expect(message).toEqual('<img src=x onerror="alert(1)">');
      expect(options.enableHtml).toBeFalse();
      done();
    });
  });
});
