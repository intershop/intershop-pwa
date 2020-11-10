import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Price } from 'ish-core/models/price/price.model';

import { QuoteContextFacade } from '../../facades/quote-context.facade';

@Component({
  selector: 'ish-quote-line-item-list',
  templateUrl: './quote-line-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteLineItemListComponent implements OnInit {
  total$: Observable<Price>;
  lineItems$: Observable<unknown[]>;
  editable$: Observable<boolean>;
  displayTotal$: Observable<boolean>;

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.total$ = this.context.select('entity', 'total');
    this.lineItems$ = this.context.select('entity', 'items');
    this.displayTotal$ = combineLatest([this.total$, this.lineItems$]).pipe(
      map(([total, items]) => !!total && !!items?.length)
    );
    this.editable$ = this.context.select('editable');
  }
}
