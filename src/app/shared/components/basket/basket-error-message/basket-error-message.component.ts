import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ScrollDirective } from 'ish-core/directives/scroll.directive';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

@Component({
  selector: 'ish-basket-error-message',
  templateUrl: './basket-error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslatePipe, ErrorMessageComponent, ScrollDirective],
})
export class BasketErrorMessageComponent {
  @Input({ required: true }) error: HttpError;
  @Input() cssClass = 'alert alert-danger';

  // default values to control scrolling behavior
  scrollSpacing = 64;

  get scrollToMessage(): boolean {
    return !!this.error;
  }
}
