import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify } from 'ts-mockito';

import * as messagesActions from './messages.actions';
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
      ],
    });

    effects = TestBed.get(MessagesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should call ToastrService when handling messages', done => {
    actions$ = of(new messagesActions.SuccessMessage({ message: 'test' }));

    effects.toast$.subscribe(() => {
      verify(toastrServiceMock.success(anything(), anything(), anything())).once();
      done();
    });
  });
});
