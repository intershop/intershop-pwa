import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

import { Group, GroupTree } from '../../models/group/group.model';

@Component({
  selector: 'ish-group-form',
  templateUrl: './group-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupFormComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() error: HttpError;
  @Input() parents: GroupTree;

  parentOptions: SelectOption[];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.form || changes.parents) {
      this.parentOptions = this.mapParentOptions(this.parents.groups);
    }
  }

  private mapParentOptions(groupMap: { [id: string]: Group }): SelectOption[] {
    return Object.keys(groupMap)
      .map(groupId => ({ value: groupId, label: groupMap[groupId].name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}
