import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { pick } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteRequest } from '../../models/quoting/quoting.model';

/**
 * The Quote Edit Component displays and updates quote or quote request data.
 * It provides modify and delete functionality for quote request items.
 */
@Component({
  selector: 'ish-quote-edit',
  templateUrl: './quote-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteEditComponent implements OnInit {
  quote$: Observable<QuoteRequest>;
  form = new FormGroup({
    displayName: new FormControl(''),
    description: new FormControl(''),
  });

  update = new Subject();
  reset = new Subject();

  constructor(private context: QuoteContextFacade) {}

  private get valuesFromQuote() {
    return pick(this.context.get('entity'), 'displayName', 'description');
  }

  ngOnInit() {
    this.quote$ = this.context.select('entityAsQuoteRequest');

    this.context.hold(this.reset, () => {
      this.form.reset(this.valuesFromQuote);
    });

    this.context.hold(this.quote$, () => this.reset.next());

    this.context.hold(
      this.update.pipe(
        map(() => [this.form.value, this.valuesFromQuote]),
        filter(
          ([a, b]) =>
            a.displayName !== b.displayName ||
            // tslint:disable-next-line: triple-equals
            a.description != b.description
        ),
        map(([meta]) => meta)
      ),
      meta => this.context.update(meta)
    );
  }

  onUpdateItem(item: LineItemUpdate) {
    this.context.updateItem(item);
  }

  onDeleteItem(itemId: string) {
    this.context.deleteItem(itemId);
  }
}
