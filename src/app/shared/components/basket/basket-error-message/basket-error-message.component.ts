import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'ish-basket-error-message',
  templateUrl: './basket-error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketErrorMessageComponent {
  @Input() error: HttpError;
  @Input() cssClass = 'alert alert-danger';
}
