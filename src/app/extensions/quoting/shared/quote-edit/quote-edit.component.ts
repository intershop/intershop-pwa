import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { pick } from 'lodash-es';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, first, map, shareReplay, startWith, switchMapTo } from 'rxjs/operators';

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

  update = new Subject();
  reset = new Subject();

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.quote$ = this.context.select('entityAsQuoteRequest');
    this.form$ = combineLatest([this.quote$, this.reset.pipe(startWith(''))]).pipe(
      map(
        ([quote]) =>
          new FormGroup({
            displayName: new FormControl(quote.displayName),
            description: new FormControl(quote.description),
          })
      ),
      shareReplay(1)
    );

    this.context.hold(
      this.update.pipe(
        switchMapTo(
          combineLatest([
            this.quote$.pipe(map(quote => pick(quote, 'displayName', 'description'))),
            this.form$.pipe(map(form => form.value)),
          ]).pipe(
            first(),
            filter(
              ([a, b]) =>
                a.displayName !== b.displayName ||
                // tslint:disable-next-line: triple-equals
                a.description != b.description
            )
          )
        )
      ),
      ([, meta]) => this.context.update(meta)
    );
  }

  onUpdateItem(item: LineItemUpdate) {
    this.context.updateItem(item);
  }

  onDeleteItem(itemId: string) {
    this.context.deleteItem(itemId);
  }
}
