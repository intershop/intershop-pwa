import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

import { Node, NodeTree } from '../../../models/node/node.model';

@Component({
  selector: 'ish-group-form',
  templateUrl: './group-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class GroupFormComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() error: HttpError;
  @Input() parents: NodeTree;
  parentOptions: SelectOption[];

  ngOnChanges() {
    this.parentOptions = this.mapParentOptions(this.parents.nodes);
  }

  private mapParentOptions(nodeMap: { [id: string]: Node }): SelectOption[] {
    return Object.keys(nodeMap)
      .map(nodeId => ({ value: nodeId, label: nodeMap[nodeId].name }))
      .sort((a: SelectOption, b: SelectOption) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
  }
}
