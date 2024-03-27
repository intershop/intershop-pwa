import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, map } from 'rxjs';

import { OrganizationGroup } from '../../../models/organization-group/organization-group.model';

@Component({
  selector: 'ish-group-form',
  templateUrl: './group-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() groups$: Observable<OrganizationGroup[]>;
  @Input() selectedParentGroup$: Observable<OrganizationGroup>;

  private destroyRef = inject(DestroyRef);

  fields: FormlyFieldConfig[];
  selectedParentGroupId: string;

  ngOnInit() {
    this.selectedParentGroup$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(group => {
      this.selectedParentGroupId = group.id;
    });
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
            defaultValue: this.selectedParentGroupId ? this.selectedParentGroupId : undefined,
            props: {
              label: 'organization.groups.parent.label',
              required: true,
              placeholder: 'organization.groups.parent.placeholder',
              options: this.groups$.pipe(
                map(groups => groups?.map(group => ({ value: group.id, label: group.displayName })))
              ),
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
