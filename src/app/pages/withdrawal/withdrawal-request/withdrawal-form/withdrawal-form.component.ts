import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, combineLatest, map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Withdrawal } from 'ish-core/models/withdrawal/withdrawal.model';

@Component({
  selector: 'ish-withdrawal-form',
  templateUrl: './withdrawal-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawalFormComponent implements OnInit {
  @Input() withdrawal: Withdrawal;
  @Output() createWithdrawal = new EventEmitter<{ orderDocumentNumber: string; orderEmail: string }>();
  @Output() submitWithdrawal = new EventEmitter<Withdrawal>();

  withdrawalForm = new FormGroup({});
  fields$: Observable<FormlyFieldConfig[]>;
  model: Partial<Withdrawal> = {};

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.getFormConfiguration();
  }

  private getFormConfiguration() {
    const isRequestMode = !!this.withdrawal;

    if (isRequestMode) {
      this.model = {
        orderDocumentNumber: this.withdrawal.orderDocumentNumber,
        orderEmail: this.withdrawal.orderEmail,
        name: undefined,
        confirmationEmail: this.withdrawal.orderEmail,
      };
    } else {
      this.model = {};
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
              },
              validation: {
                messages: {
                  required: 'account.withdrawal.form.request.order_username.error',
                },
              },
            },
            {
              key: 'confirmationEmail',
              type: 'ish-text-input-field',
              props: {
                label: 'account.withdrawal.form.request.confirmation_email.label',
                required: true,
                postWrappers: [{ wrapper: 'description', index: -1 }],
                customDescription: {
                  key: 'account.withdrawal.form.request.confirmation_email.extrainfo.message',
                },
              },
              validation: {
                messages: {
                  required: 'account.withdrawal.form.request.confirmation_email.error',
                },
              },
            },
          ]
        : [
            {
              key: 'orderEmail',
              type: 'ish-text-input-field',
              props: {
                label: 'account.withdrawal.form.search.order_email.label',
                required: true,
                postWrappers: [{ wrapper: 'description', index: -1 }],
                customDescription: {
                  key: 'account.withdrawal.form.search.order_email.extrainfo.message',
                },
              },
              validation: {
                messages: {
                  required: 'account.withdrawal.form.search.order_email.error',
                },
              },
            },
          ]),
      ...(isCaptchaEnabled
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

  get isRequestMode(): boolean {
    return !!this.withdrawal;
  }

  get submitButtonLabel(): string {
    return this.isRequestMode
      ? 'account.withdrawal.form.request.button.label'
      : 'account.withdrawal.form.search.button.label';
  }

  submitForm() {
    if (this.withdrawalForm.invalid) {
      return;
    }

    if (this.isRequestMode) {
      this.submitWithdrawal.emit({
        ...this.withdrawalForm.value,
        orderDocumentNumber: this.withdrawal.orderDocumentNumber,
        name: this.withdrawalForm.get('name').value,
        orderEmail: this.withdrawal.orderEmail,
        confirmationEmail: this.withdrawalForm.get('confirmationEmail').value,
        id: this.withdrawal.id,
      });
    } else {
      this.createWithdrawal.emit({
        ...this.withdrawalForm.value,
        orderDocumentNumber: this.withdrawalForm.get('orderDocumentNumber').value,
        orderEmail: this.withdrawalForm.get('orderEmail').value,
      });
    }
  }
}
