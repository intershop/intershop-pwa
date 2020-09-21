import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap } from 'rxjs/operators';

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
export class QuoteEditComponent implements OnInit {
  quote$: Observable<QuoteRequest>;
  form$: Observable<FormGroup>;

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.quote$ = this.context.select('entityAsQuoteRequest');
    this.form$ = this.quote$.pipe(
      map(
        quote =>
          new FormGroup({
            displayName: new FormControl(quote.displayName),
            description: new FormControl(quote.description),
          })
      ),
      shareReplay(1)
    );

    this.context.hold(
      this.form$.pipe(
        switchMap(form => form.valueChanges),
        debounceTime(800)
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
