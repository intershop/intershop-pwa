import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteRequest } from '../../models/quoting/quoting.model';

/**
 * The Quote Edit Component displays and updates quote or quote request data.
 * It provides modify and delete functionality for quote request items.
 * It provides functionality to submit a quote request.
 */
@Component({
  selector: 'ish-quote-edit',
  templateUrl: './quote-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditComponent implements OnChanges {
  @Input() quote: QuoteRequest;

  form: FormGroup;

  constructor(private context: QuoteContextFacade) {
    this.form = new FormGroup({
      displayName: new FormControl(undefined, [Validators.maxLength(255)]),
      description: new FormControl(undefined, []),
    });
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.quote) {
      this.patchForm();
    }
  }

  private patchForm() {
    if (this.quote.displayName) {
      this.form.patchValue({ displayName: this.quote.displayName });
    }
    if (this.quote.description) {
      this.form.patchValue({ description: this.quote.description });
    }
  }

  onUpdateItem(item: LineItemUpdate) {
    console.log('TODO', 'onUpdateItem', item);
  }

  onDeleteItem(itemId: string) {
    console.log('TODO', 'onDeleteItem', itemId);
  }

  submit() {
    if (this.form && this.form.dirty) {
      console.log('TODO', 'save & submit', this.form.value);
    } else {
      this.context.submit();
    }
  }

  update() {
    console.log('TODO', 'update');
  }
}
