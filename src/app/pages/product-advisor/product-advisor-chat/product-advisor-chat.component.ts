import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-product-advisor-chat',
  standalone: false,
  templateUrl: './product-advisor-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorChatComponent {
  @Input() deviceType: DeviceType;
}
