import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';

import { mapToPayload } from 'ish-core/utils/operators';

import {
  MessagesPayloadType,
  displayErrorMessage,
  displayInfoMessage,
  displaySuccessMessage,
  displayWarningMessage,
} from './messages.actions';

@Injectable()
export class MessagesEffects {
  constructor(private actions$: Actions, private translate: TranslateService, private toastr: ToastrService) {}

  infoToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayInfoMessage),
        mapToPayload(),
        tap(payload => {
          this.toastr.info(...this.composeToastServiceArguments(payload));
        })
      ),
    { dispatch: false }
  );

  errorToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayErrorMessage),
        mapToPayload(),
        tap(payload => {
          this.toastr.error(...this.composeToastServiceArguments(payload));
        })
      ),
    { dispatch: false }
  );

  warningToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayWarningMessage),
        mapToPayload(),
        tap(payload => {
          this.toastr.warning(...this.composeToastServiceArguments(payload));
        })
      ),
    { dispatch: false }
  );

  successToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displaySuccessMessage),
        mapToPayload(),
        tap(payload => {
          this.toastr.success(...this.composeToastServiceArguments(payload));
        })
      ),
    { dispatch: false }
  );

  private composeToastServiceArguments(payload: MessagesPayloadType): [string, string, Partial<IndividualConfig>] {
    return [
      // message translation
      this.translate.instant(payload.message, payload.messageParams),
      // title translation
      payload.title ? this.translate.instant(payload.title, payload.titleParams) : payload.title,
      // extra options
      {
        timeOut: payload.duration !== undefined ? payload.duration : 5000,
        extendedTimeOut: 5000,
        progressBar: false,
        closeButton: false,
        positionClass: 'toast-top-right',
        // defaults
        // toastClass: 'ngx-toastr',
        // titleClass: 'toast-title',
        // messageClass: 'toast-message',
      },
    ];
  }
}
