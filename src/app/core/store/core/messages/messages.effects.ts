import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerRequestAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';
import { OperatorFunction, Subject, combineLatest } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

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
        this.composeToastServiceArguments(0),
        map(args => this.toastr.info(...args)),
        tap(() => {
          this.applyStyle$.next();
        }),
        this.closeToastOnRouting()
      ),
    { dispatch: false }
  );

  errorToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayErrorMessage),
        mapToPayload(),
        this.composeToastServiceArguments(0),
        map(args => this.toastr.error(...args)),
        tap(() => {
          this.applyStyle$.next();
        }),
        this.closeToastOnRouting()
      ),
    { dispatch: false }
  );

  warningToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayWarningMessage),
        mapToPayload(),
        this.composeToastServiceArguments(0),
        map(args => this.toastr.warning(...args)),
        tap(() => {
          this.applyStyle$.next();
        }),
        this.closeToastOnRouting()
      ),
    { dispatch: false }
  );

  successToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displaySuccessMessage),
        mapToPayload(),
        this.composeToastServiceArguments(),
        map(args => this.toastr.success(...args)),
        tap(() => {
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
              container.classList.add('toast-sticky');
            } else {
              container.classList.remove('toast-sticky');
            }
          }
        })
      ),
    { dispatch: false }
  );

  private closeToastOnRouting() {
    return switchMap((activeToast: ActiveToast<unknown>) =>
      this.actions$.pipe(
        ofType(routerRequestAction),
        take(1),
        tap(() => {
          activeToast.toastRef.manualClose();
        })
      )
    );
  }

  private composeToastServiceArguments(
    duration?: number
  ): OperatorFunction<MessagesPayloadType, [string, string, Partial<IndividualConfig>]> {
    return stream$ =>
      stream$.pipe(
        withLatestFrom(this.store.pipe(select(getDeviceType))),
        map(([payload, deviceType]) => {
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
              positionClass: deviceType === 'desktop' ? 'toast-top-full-width' : 'toast-bottom-center',
            },
          ];
        })
      );
  }
}
