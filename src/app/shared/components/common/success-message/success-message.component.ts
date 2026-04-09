import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { MessageFacade } from 'ish-core/facades/message.facade';

@Component({
  selector: 'ish-success-message',
  templateUrl: './success-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslatePipe],
})
export class SuccessMessageComponent implements OnChanges {
  /**  key or message is accepted */
  @Input({ required: true }) message: string;
  @Input() toast = true;

  constructor(private messageFacade: MessageFacade) {}

  ngOnChanges() {
    if (this.toast) {
      this.displayToast();
    }
  }

  private displayToast() {
    if (this.message) {
      this.messageFacade.success({
        message: this.message,
      });
    }
  }
}
