import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  Observable,
  Subject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  takeUntil,
  withLatestFrom,
  startWith,
} from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';
import { log } from 'ish-core/utils/dev/operators';

/**
 * The Account Payment Component displays the preferred payment method/instrument of the user
 * and any further payment options. The user can delete payment instruments and change the preferred payment method/instrument.
 * Adding a payment instrument is only possible during the checkout.
 * see also: {@link AccountPaymentPageComponent}
 */
@Component({
  selector: 'ish-account-payment',
  templateUrl: './account-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPaymentComponent implements OnInit, OnDestroy {
  @Input() paymentMethods: PaymentMethod[];
  @Input() user: User;

  paymentMethods$: Observable<PaymentMethod[]>;

  fieldConfig$: Observable<FormlyFieldConfig[]>;
  paymentFormGroup: FormGroup = new FormGroup({});

  preferredPaymentInstrument$: Observable<PaymentInstrument>;
  preferredPayment$: Observable<{ instrument: PaymentInstrument; method?: PaymentMethod }>;

  // to remove
  preferredPaymentInstrument: PaymentInstrument;
  savedPaymentMethods: PaymentMethod[];
  standardPaymentMethods: PaymentMethod[];

  private destroy$ = new Subject<void>();

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.paymentMethods$ = this.accountFacade.paymentMethods$().pipe(shareReplay(1), log('pm'));

    const preferredPaymentInstrument$ = combineLatest([
      this.paymentMethods$,
      this.accountFacade.user$,
      this.paymentFormGroup.valueChanges.pipe(startWith({})),
    ]).pipe(
      map(([pms, user]) => {
        if (!pms?.length || !user) {
          return;
        }
        return pms
          .map(pm => pm.paymentInstruments)
          .flat()
          .find(pi => pi.id === user.preferredPaymentInstrumentId);
      }),
      distinctUntilChanged(),
      shareReplay(1),
      log('pfi')
    );

    this.preferredPayment$ = combineLatest([preferredPaymentInstrument$, this.paymentMethods$]).pipe(
      filter(([preferredInstrument]) => !!preferredInstrument),
      map(([preferredInstrument, methods]) => ({
        instrument: preferredInstrument,
        method: methods?.find(pm => pm.id === preferredInstrument.paymentMethod),
      })),
      log('preferred payment')
    );

    // TODO: USE FORMLY FOR RESETTING PAYMENT METHOD
    this.fieldConfig$ = combineLatest([preferredPaymentInstrument$, this.paymentMethods$]).pipe(
      map<[PaymentInstrument, PaymentMethod[]], FormlyFieldConfig[]>(([preferredPaymentInstrument, paymentMethods]) => {
        console.log('trigger', paymentMethods);
        const standardPaymentMethods =
          paymentMethods?.filter(pm => !pm.paymentInstruments?.length) ?? ([] as PaymentMethod[]);
        const savedPaymentMethods =
          paymentMethods?.filter(
            pm => pm.paymentInstruments?.length && !(preferredPaymentInstrument?.paymentMethod === pm.id)
          ) ?? ([] as PaymentMethod[]);

        return [
          ...savedPaymentMethods.map(paymentMethod => ({
            type: 'ish-panel-group',
            templateOptions: {
              label: paymentMethod.displayName,
              childClass: 'panel',
              fieldsetClass: 'payment-methods',
            },
            fieldGroup: paymentMethod.paymentInstruments.map(pi => ({
              type: 'ish-radio-field',
              key: 'preferred-payment',
              templateOptions: {
                fieldClass: ' ',
                value: `pi_${pi.id}`,
                label: pi.accountIdentifier,
              },
            })),
          })),
          {
            type: 'ish-panel-group',
            templateOptions: { label: 'saved', childClass: 'panel', fieldsetClass: 'payment-methods' },
            fieldGroup: standardPaymentMethods.map(toRadioField),
          },
          preferredPaymentInstrument
            ? {
                type: 'ish-panel-group',
                templateOptions: { label: 'none' },
                fieldGroup: [
                  {
                    type: 'ish-radio-field',
                    key: 'preferred-payment',
                    templateOptions: {
                      fieldClass: ' ',
                      value: '',
                      label: 'account.payment.no_preferred_method',
                    },
                  },
                ],
              }
            : {},
        ];

        function toRadioField(paymentMethod: PaymentMethod): FormlyFieldConfig {
          return {
            type: 'ish-radio-field',
            key: 'preferred-payment',
            templateOptions: {
              fieldClass: ' ',
              value: `pm_${paymentMethod.id}`,
              label: paymentMethod.displayName,
            },
          };
        }
      })
    );

    this.paymentFormGroup.valueChanges
      .pipe(
        map(values => values['preferred-payment'] as string),
        distinctUntilChanged(),
        filter(v => !!v || v === ''),
        withLatestFrom(preferredPaymentInstrument$),
        takeUntil(this.destroy$)
      )
      .subscribe(([id, preferred]) => {
        this.setAsDefaultPayment(id, preferred);
      });
  }
  /**
   * deletes a user payment instrument and triggers a toast in case of success
   */
  deleteUserPayment(paymentInstrumentId: string) {
    if (paymentInstrumentId) {
      this.accountFacade.deletePaymentInstrument(paymentInstrumentId, {
        message: 'account.payment.payment_deleted.message',
      });
    }
  }

  /**
   * change the user's preferred payment instrument
   */
  setAsDefaultPayment(value: string, preferredPaymentInstrument?: PaymentInstrument) {
    // TODO: MAKE READABLE
    const { id, artifact } =
      value === ''
        ? { id: '', artifact: 'none' }
        : value.startsWith('pi_')
        ? { id: value.replace('pi_', ''), artifact: 'instrument' }
        : { id: value.replace('pm_', ''), artifact: 'method' };
    // TODO: CORRECTLY HANDLE REMOVAL CASE
    // TODO: REFACTOR FACADE AND REMOVE 3rd ARG
    if (value === preferredPaymentInstrument?.id) {
      return;
    }
    if (id && artifact === 'method') {
      this.accountFacade.updateUserPreferredPaymentMethod(this.user, id, preferredPaymentInstrument);
    } else {
      this.accountFacade.updateUserPreferredPaymentInstrument(this.user, id, preferredPaymentInstrument);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
