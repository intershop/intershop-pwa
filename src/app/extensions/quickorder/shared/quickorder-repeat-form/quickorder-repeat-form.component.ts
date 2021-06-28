import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'ish-quickorder-repeat-form',
  templateUrl: './quickorder-repeat-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderRepeatFormComponent extends FieldArrayType {
  addMultipleRows(rows: number) {
    for (let i = 0; i < rows; i++) {
      this.add(this.model.length, { sku: '', quantity: undefined });
    }
  }
}
