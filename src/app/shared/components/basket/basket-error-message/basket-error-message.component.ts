import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ReplaySubject, asyncScheduler, scheduled, switchMap } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

/**
 * Displays basket-related HTTP error messages and automatically scrolls
 * the message into view whenever the error input changes.
 */
@Component({
  selector: 'ish-basket-error-message',
  templateUrl: './basket-error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgFor, TranslatePipe, ErrorMessageComponent],
})
export class BasketErrorMessageComponent implements OnChanges {
  @Input({ required: true }) error: HttpError;
  @Input() cssClass = 'alert alert-danger';

  // default values to control scrolling behavior
  scrollSpacing = 64;

  private scrollTrigger$ = new ReplaySubject<void>(1);
  // Emits false, then true asynchronously to ensure the directive's ngOnChanges is triggered
  scrollToMessage$ = this.scrollTrigger$.pipe(switchMap(() => scheduled([false, true], asyncScheduler)));

  ngOnChanges() {
    if (this.error) {
      this.scrollTrigger$.next();
    }
  }
}
