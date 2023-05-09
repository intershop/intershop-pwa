import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { OciConfiguration } from '../../../models/oci-configuration/oci-configuration.model';

@Component({
  selector: 'ish-oci-configuration-form',
  templateUrl: './oci-configuration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OciConfigurationFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  // ToDo: should get data from facade
  model: { ociConfig: OciConfiguration[] } = {
    ociConfig: [
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-UNIT', transform: '', formatter: '' },
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-VENDOR', transform: '', formatter: '' },
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-MATGROUP', transform: '', formatter: '' },
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-CONTRACT', transform: '', formatter: '' },
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-CONTRACT_ITEM', transform: '', formatter: '' },
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-CUST_FIELD1', transform: '', formatter: '' },
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-CUST_FIELD2', transform: '', formatter: '' },
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-CUST_FIELD3', transform: '', formatter: '' },
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-CUST_FIELD4', transform: '', formatter: '' },
      { type: 'PunchoutConfigurationItem', field: 'NEW_ITEM-CUST_FIELD5', transform: '', formatter: '' },
    ],
  };
  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.fields = this.getFields();
  }

  private getFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'ociConfig',
        type: 'repeat',
        fieldArray: {
          fieldGroupClassName: 'row list-item-row',
          fieldGroup: [
            {
              key: 'field',
              type: 'ish-plain-text-field',
              className: 'list-item col-md-3',
              props: {
                fieldClass: 'col-md-11',
                inputClass: 'col-form-label',
              },
            },
            {
              key: 'transform',
              type: 'ish-text-input-field',
              className: 'list-item col-md-3',
              props: {
                fieldClass: 'col-md-11',
              },
            },
            // ToDo
            {
              key: 'mapping',
              type: 'ish-plain-text-field',
              className: 'list-item col-md-3',
            },
            // ToDo
            {
              key: 'formatter',
              type: 'ish-select-field',
              className: 'list-item col-md-3',
              props: {
                fieldClass: 'col-12 label-empty',
                options: [
                  {
                    value: '',
                    label: `None`,
                  },
                ],
              },
            },
          ],
        },
      },
    ];
  }
}
