import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

import { NodeTree, Node } from '../../../models/node/node.model';

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

  private mapParentOptions(bla: { [id: string]: Node }): SelectOption[] {
    return Object.keys(bla).map(node => ({ value: node, label: this.parents.nodes[node].name }));
  }
}
