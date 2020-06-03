import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';

import { mapToPayload } from 'ish-core/utils/operators';

import {
  DisplayErrorMessage,
  DisplayInfoMessage,
  DisplaySuccessMessage,
  DisplayWarningMessage,
  MessagesActionTypes,
  MessagesPayloadType,
} from './messages.actions';

@Injectable()
export class MessagesEffects {
  constructor(private actions$: Actions, private translate: TranslateService, private toastr: ToastrService) {}

  @Effect({ dispatch: false })
  infoToast$ = this.actions$.pipe(
    ofType<DisplayInfoMessage>(MessagesActionTypes.DisplayInfoMessage),
    mapToPayload(),
    tap(payload => {
      this.toastr.info(...this.composeToastServiceArguments(payload));
    })
  );

  @Effect({ dispatch: false })
  errorToast$ = this.actions$.pipe(
    ofType<DisplayErrorMessage>(MessagesActionTypes.DisplayErrorMessage),
    mapToPayload(),
    tap(payload => {
      this.toastr.error(...this.composeToastServiceArguments(payload));
    })
  );

  @Effect({ dispatch: false })
  warningToast$ = this.actions$.pipe(
    ofType<DisplayWarningMessage>(MessagesActionTypes.DisplayWarningMessage),
    mapToPayload(),
    tap(payload => {
      this.toastr.warning(...this.composeToastServiceArguments(payload));
    })
  );

  @Effect({ dispatch: false })
  successToast$ = this.actions$.pipe(
    ofType<DisplaySuccessMessage>(MessagesActionTypes.DisplaySuccessMessage),
    mapToPayload(),
    tap(payload => {
      this.toastr.success(...this.composeToastServiceArguments(payload));
    })
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
