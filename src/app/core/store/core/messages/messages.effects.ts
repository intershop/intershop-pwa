import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Subject, combineLatest } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';

import { getDeviceType } from 'ish-core/store/core/configuration';
import { isStickyHeader } from 'ish-core/store/core/viewconf';
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
  constructor(
    private actions$: Actions,
    private store: Store,
    private translate: TranslateService,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  private applyStyle$ = new Subject();

  infoToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayInfoMessage),
        mapToPayload(),
        withLatestFrom(this.store.pipe(select(getDeviceType))),
        tap(([payload, deviceType]) => {
          this.toastr.info(...this.composeToastServiceArguments(payload, deviceType, 0));
          this.applyStyle$.next();
        })
      ),
    { dispatch: false }
  );

  errorToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayErrorMessage),
        mapToPayload(),
        withLatestFrom(this.store.pipe(select(getDeviceType))),
        tap(([payload, deviceType]) => {
          this.toastr.error(...this.composeToastServiceArguments(payload, deviceType, 0));
          this.applyStyle$.next();
        })
      ),
    { dispatch: false }
  );

  warningToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayWarningMessage),
        mapToPayload(),
        withLatestFrom(this.store.pipe(select(getDeviceType))),
        tap(([payload, deviceType]) => {
          this.toastr.warning(...this.composeToastServiceArguments(payload, deviceType, 0));
          this.applyStyle$.next();
        })
      ),
    { dispatch: false }
  );

  successToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displaySuccessMessage),
        mapToPayload(),
        withLatestFrom(this.store.pipe(select(getDeviceType))),
        tap(([payload, deviceType]) => {
          this.toastr.success(...this.composeToastServiceArguments(payload, deviceType));
          this.applyStyle$.next();
        })
      ),
    { dispatch: false }
  );

  setToastStickyClass$ = createEffect(
    () =>
      combineLatest([this.store.pipe(select(isStickyHeader)), this.applyStyle$]).pipe(
        tap(([sticky]) => {
          const container = this.document.getElementById('toast-container');
          if (container) {
            if (sticky) {
              container.className += ' toast-sticky';
            } else {
              container.className = container.className.replace(' toast-sticky', '');
            }
          }
        })
      ),
    { dispatch: false }
  );

  private composeToastServiceArguments(
    payload: MessagesPayloadType,
    deviceType: string,
    duration?: number
  ): [string, string, Partial<IndividualConfig>] {
    const timeOut = payload.duration ?? duration ?? 5000;

    return [
      // message translation
      this.translate.instant(payload.message, payload.messageParams),
      // title translation
      payload.title ? this.translate.instant(payload.title, payload.titleParams) : payload.title,
      // extra options
      {
        timeOut,
        extendedTimeOut: 3000,
        progressBar: false,
        closeButton: timeOut === 0,
        enableHtml: true,
        tapToDismiss: true,
        positionClass: deviceType !== 'mobile' ? 'toast-top-full-width' : 'toast-bottom-center',
      },
    ];
  }
}
