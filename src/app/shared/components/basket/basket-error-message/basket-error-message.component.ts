import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'ish-basket-error-message',
  templateUrl: './basket-error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketErrorMessageComponent implements OnChanges {
  @Input({ required: true }) error: HttpError;
  @Input() cssClass = 'alert alert-danger';

  scrollToMessage = false;
  // default values to control scrolling behavior
  scrollSpacing = 64;

  ngOnChanges(c: SimpleChanges): void {
    // Scroll to error messages when error occurs
    if (c.error?.currentValue && !c.error.firstChange) {
      this.scrollToMessage = true;
    }
  }
}
