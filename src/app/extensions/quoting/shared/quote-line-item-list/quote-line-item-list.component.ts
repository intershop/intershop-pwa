import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';

import { QuoteContextFacade } from '../../facades/quote-context.facade';
import { QuoteRequestItem } from '../../models/quoting/quoting.model';
import { QuoteLineItemListElementComponent } from '../quote-line-item-list-element/quote-line-item-list-element.component';

@Component({
  selector: 'ish-quote-line-item-list',
  imports: [AsyncPipe, NgClass, PricePipe, ProductContextDirective, QuoteLineItemListElementComponent, TranslatePipe],
  standalone: true,
  templateUrl: './quote-line-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteLineItemListComponent implements OnInit {
  total$: Observable<Price>;
  lineItems$: Observable<Pick<QuoteRequestItem, 'productSKU' | 'quantity'>[]>;
  editable$: Observable<boolean>;
  displayTotal$: Observable<boolean>;

  constructor(private context: QuoteContextFacade) {}

  ngOnInit() {
    this.total$ = this.context.select('entity', 'total');
    this.lineItems$ = this.context.select('entity', 'items') as Observable<
      Pick<QuoteRequestItem, 'productSKU' | 'quantity'>[]
    >;
    this.displayTotal$ = combineLatest([this.total$, this.lineItems$]).pipe(
      map(([total, items]) => !!total && !!items?.length)
    );
    this.editable$ = this.context.select('editable');
  }
}
