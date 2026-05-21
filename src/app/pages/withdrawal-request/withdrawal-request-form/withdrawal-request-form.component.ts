import { ChangeDetectionStrategy, Component, OnInit, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, combineLatest, map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';

/**
 * Dual-mode form component for handling withdrawal (right of withdrawal) requests.
 *
 * The component operates in two modes based on the presence of the `withdrawal` input:
 *
 * **Search Mode** (no withdrawal input):
 * - Displays fields for order number and order email
 * - Emits `createWithdrawal` event to initiate a withdrawal entry
 *
 * **Request Mode** (withdrawal input provided):
 * - Displays fields for customer name and confirmation email
 * - Pre-fills order data from the existing withdrawal
 * - Emits `submitWithdrawal` event to complete the withdrawal request
 *
 * Both modes support optional CAPTCHA validation based on server configuration.
 *
 * @example
 * <!-- Search mode -->
 * <ish-withdrawal-form (createWithdrawal)="onCreateWithdrawal($event)" />
 *
 * @example
 * <!-- Request mode -->
 * <ish-withdrawal-form [withdrawal]="withdrawal" (submitWithdrawal)="onSubmitWithdrawal($event)" />
 */
@Component({
  selector: 'ish-withdrawal-request-form',
  standalone: false,
  templateUrl: './withdrawal-request-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawalRequestFormComponent implements OnInit {
  readonly withdrawal = input<Withdrawal>();
  readonly orderData = input<{ orderDocumentNumber: string; orderEmail: string }>();
  readonly createWithdrawal = output<{ orderDocumentNumber: string; orderEmail: string }>();
  readonly submitWithdrawal = output<Withdrawal>();

  withdrawalForm = new FormGroup({});
  fields$: Observable<FormlyFieldConfig[]>;
  model: Partial<Withdrawal> = {};
  submitButtonLabel: string;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.getFormConfiguration();
  }

  submitForm() {
    if (this.withdrawalForm.invalid) {
      return;
    }

    if (this.isRequestMode()) {
      const withdrawal = this.withdrawal();
      this.submitWithdrawal.emit({
        ...this.withdrawalForm.value,
        orderDocumentNumber: withdrawal.orderDocumentNumber,
        name: this.withdrawalForm.get('name').value,
        orderEmail: withdrawal.orderEmail,
        confirmationEmail: this.withdrawalForm.get('confirmationEmail').value,
        id: withdrawal.id,
      });
    } else {
      this.createWithdrawal.emit({
        ...this.withdrawalForm.value,
        orderDocumentNumber: this.withdrawalForm.get('orderDocumentNumber').value,
        orderEmail: this.withdrawalForm.get('orderEmail').value,
      });
    }
  }

  private getFormConfiguration() {
    const withdrawal = this.withdrawal();
    const isRequestMode = !!withdrawal;
    this.submitButtonLabel = isRequestMode
      ? 'account.withdrawal.form.request.button.label'
      : 'account.withdrawal.form.search.button.label';

    if (isRequestMode) {
      this.model = {
        orderDocumentNumber: withdrawal.orderDocumentNumber,
        orderEmail: withdrawal.orderEmail,
        name: undefined,
        confirmationEmail: withdrawal.orderEmail,
      };
    } else {
      const orderData = this.orderData();
      this.model =
        orderData?.orderDocumentNumber && orderData?.orderEmail
          ? {
              orderDocumentNumber: orderData.orderDocumentNumber,
              orderEmail: orderData.orderEmail,
            }
          : {};
    }

    this.fields$ = combineLatest([
      this.appFacade.serverSetting$<boolean>('services.ReCaptchaV2ServiceDefinition.runnable'),
      this.appFacade.serverSetting$<boolean>('captcha.withdrawal'),
    ]).pipe(
      map(([isCaptchaV2, isCaptchaTopicEnabled]) => this.buildFields(isRequestMode, isCaptchaTopicEnabled, isCaptchaV2))
    );
  }

  private buildFields(isRequestMode: boolean, isCaptchaEnabled: boolean, isCaptchaV2: boolean): FormlyFieldConfig[] {
    return [
      {
        key: 'orderDocumentNumber',
        type: 'ish-text-input-field',
        props: {
          label: 'account.withdrawal.form.search.order_number.label',
          required: true,
          disabled: isRequestMode,
          hideRequiredMarker: true,
        },
        validation: {
          messages: {
            required: 'account.withdrawal.form.search.order_number.error',
          },
        },
      },
      ...(isRequestMode
        ? [
            {
              key: 'name',
              type: 'ish-text-input-field',
              props: {
                label: 'account.withdrawal.form.request.order_username.label',
                required: true,
                hideRequiredMarker: true,
              },
              validation: {
                messages: {
                  required: 'account.withdrawal.form.request.order_username.error',
                },
              },
            },
            {
              key: 'confirmationEmail',
              type: 'ish-email-field',
              props: {
                label: 'account.withdrawal.form.request.confirmation_email.label',
                required: true,
                hideRequiredMarker: true,
                postWrappers: [{ wrapper: 'description', index: -1 }],
                customDescription: {
                  key: 'account.withdrawal.form.request.confirmation_email.extrainfo.message',
                },
              },
            },
          ]
        : [
            {
              key: 'orderEmail',
              type: 'ish-email-field',
              props: {
                label: 'account.withdrawal.form.search.order_email.label',
                required: true,
                hideRequiredMarker: true,
                postWrappers: [{ wrapper: 'description', index: -1 }],
                customDescription: {
                  key: 'account.withdrawal.form.search.order_email.extrainfo.message',
                },
              },
            },
          ]),
      ...(isCaptchaEnabled && !isRequestMode
        ? [
            {
              type: 'ish-captcha-field',
              props: {
                topic: 'withdrawal',
                required: isCaptchaV2,
                fieldClass: 'offset-md-4 col-md-8',
              },
            },
          ]
        : []),
    ];
  }

  private isRequestMode(): boolean {
    return !!this.withdrawal();
  }
}
