import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-account-page',
  templateUrl: './account-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
  @Input() deviceType: DeviceType;
  @Input() breadcrumbData: BreadcrumbItem;
}
