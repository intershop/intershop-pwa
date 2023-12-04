import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, map } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { Group } from '../../models/group/group.model';

@Component({
  selector: 'ish-group-form',
  templateUrl: './group-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() groups$: Observable<Group[]>;
  @Input() error: HttpError;

  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.fields = this.getFields();
  }

  private getFields() {
    return [
      {
        type: 'ish-fieldset-field',
        fieldGroup: [
          {
            key: 'groupName',
            type: 'ish-text-input-field',
            props: {
              label: 'organization.groups.name.label',
              required: true,
            },
            validation: {
              messages: {
                required: 'organization.groups.new.name.error.required',
              },
            },
          },
          {
            key: 'groupDescription',
            type: 'ish-text-input-field',
            props: {
              label: 'organization.groups.description.label',
            },
          },
          {
            key: 'parentGroupId',
            type: 'ish-select-field',
            props: {
              label: 'organization.groups.parent.label',
              required: true,
              placeholder: 'organization.groups.parent.placeholder',
              options: this.groups$.pipe(map(groups => groups?.map(group => ({ value: group.id, label: group.name })))),
            },
            validation: {
              messages: {
                required: 'organization.groups.new.parent.error.required',
              },
            },
          },
        ],
      },
    ];
  }
}
