import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';

@Component({
  selector: 'ish-select-order-template-form',
  templateUrl: './select-order-template-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOrderTemplateFormComponent implements OnInit {
  @Input() formGroup: FormGroup;

  /**
   * changes the some logic and the translations keys between add or move a product (default: 'add')
   */
  @Input() addMoveProduct: 'add' | 'move' = 'add';

  orderTemplatesOptions$: Observable<SelectOption[]>;

  singleFieldConfig: FormlyFieldConfig[];
  multipleFieldConfig$: Observable<FormlyFieldConfig[]>;

  constructor(private orderTemplatesFacade: OrderTemplatesFacade, private translate: TranslateService) {}

  ngOnInit(): void {
    this.orderTemplatesOptions$ = this.orderTemplatesFacade.orderTemplatesSelectOptions$(
      this.addMoveProduct === 'move'
    );

    // formly config for the single input field form (no or no other order templates exist)
    this.singleFieldConfig = [
      {
        type: 'ish-text-input-field',
        key: 'newOrderTemplate',
        defaultValue: this.translate.instant('account.order_template.new_order_template.text'),
        props: {
          required: true,
        },
        validators: {
          validation: [SpecialValidators.noHtmlTags],
        },
        validation: {
          messages: {
            required: 'account.order_template.name.error.required',
            noHtmlTags: 'account.name.error.forbidden.html.chars',
          },
        },
      },
    ];

    // formly config for the radio button form (one or more other order templates exist)
    this.multipleFieldConfig$ = this.orderTemplatesOptions$.pipe(
      map(orderTemplateOptions =>
        orderTemplateOptions.map(option => ({
          type: 'ish-radio-field',
          key: 'orderTemplate',
          defaultValue: orderTemplateOptions[0].value,
          props: {
            fieldClass: ' ',
            value: option.value,
            label: option.label,
          },
        }))
      ),
      map(formlyConfig => [
        ...formlyConfig,
        {
          fieldGroupClassName: 'form-check d-flex',
          fieldGroup: [
            {
              type: 'ish-radio-field',
              key: 'orderTemplate',
              props: {
                inputClass: 'position-static',
                fieldClass: ' ',
                value: 'new',
              },
            },
            {
              type: 'ish-text-input-field',
              key: 'newOrderTemplate',
              className: 'w-75 position-relative validation-offset-0',
              wrappers: ['validation'],
              defaultValue: this.translate.instant('account.order_template.new_order_template.text'),
              props: {
                required: true,
              },
              validators: {
                validation: [SpecialValidators.noHtmlTags],
              },
              validation: {
                messages: {
                  required: 'account.order_template.name.error.required',
                  noHtmlTags: 'account.name.error.forbidden.html.chars',
                },
              },
              expressions: {
                'props.disabled': conf => conf.model.orderTemplate !== 'new',
              },
            },
          ],
        },
      ])
    );
  }
}
