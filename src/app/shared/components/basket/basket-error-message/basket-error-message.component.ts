import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'ish-basket-error-message',
  templateUrl: './basket-error-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgFor, TranslateModule],
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
