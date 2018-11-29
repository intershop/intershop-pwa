// tslint:disable:component-creation-test
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-lazy-basket-add-to-quote',
  templateUrl: './lazy-basket-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyBasketAddToQuoteComponent {
  componentLocation = {
    moduleId: 'ish-extensions-quoting',
    selector: 'ish-basket-add-to-quote-container',
  };
}
