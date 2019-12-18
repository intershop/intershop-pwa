import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-lazy-quote-widget',
  templateUrl: './lazy-quote-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyQuoteWidgetComponent {
  componentLocation = {
    moduleId: 'ish-extensions-quoting',
    selector: 'ish-quote-widget',
  };
}
