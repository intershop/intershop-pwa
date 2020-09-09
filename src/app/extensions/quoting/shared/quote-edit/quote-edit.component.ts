import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { Price } from 'ish-core/models/price/price.model';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteRequest, QuoteRequestItem } from '../../models/quoting/quoting.model';

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
export class QuoteEditComponent implements OnInit {
  quote$: Observable<QuoteRequest>;
  form$: Observable<FormGroup>;
  formBackedLineItems$: Observable<QuoteRequestItem[]>;
  formBackedTotal$: Observable<Price>;

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.quote$ = this.context.entityAsQuoteRequest$;
    this.form$ = this.context.form$;
    this.formBackedLineItems$ = this.context.formBackedLineItems$;
    this.formBackedTotal$ = this.context.formBackedTotal$;
  }

  onUpdateItem(item: LineItemUpdate) {
    this.context.updateItem(item);
  }

  onDeleteItem(itemId: string) {
    this.context.deleteItem(itemId);
  }
}
