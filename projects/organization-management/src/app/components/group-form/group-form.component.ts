import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

import { Node, NodeTree } from '../../models/node/node.model';

@Component({
  selector: 'ish-group-form',
  templateUrl: './group-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupFormComponent {
  @Input() form: FormGroup;
  @Input() error: HttpError;
  @Input() parents: NodeTree;

  toOptions(pairs: KeyValue<string, Node>[]): SelectOption[] {
    return pairs.map(value => ({
      label: value.value.name,
      value: value.key,
    }));
  }
}
