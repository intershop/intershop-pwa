import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import * as messagesActions from './messages.actions';

@Injectable()
export class MessagesEffects {
  constructor(private actions$: Actions, private translate: TranslateService, private toastr: ToastrService) {}

  @Effect({ dispatch: false })
  toast$ = this.actions$.pipe(
    ofType<messagesActions.MessagesActions>(messagesActions.MessagesActionTypes.ToastMessage),
    switchMap(({ payload, messageType }) =>
      forkJoin([
        // message translation
        this.translate.get(payload.message, payload.messageParams).pipe(take(1)),
        // title translation
        payload.title ? this.translate.get(payload.title, payload.titleParams).pipe(take(1)) : of(payload.title),
        // extra options
        of({
          timeOut: payload.duration !== undefined ? payload.duration : 5000,
          extendedTimeOut: 5000,
          progressBar: false,
          closeButton: false,
          positionClass: 'toast-top-right',
          // defaults
          // toastClass: 'ngx-toastr',
          // titleClass: 'toast-title',
          // messageClass: 'toast-message',
        }),
      ]).pipe(tap(args => this.toastr[messageType](...args)))
    )
  );
}
