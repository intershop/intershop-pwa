import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StoreLocation as StoreModel } from '../../models/store-location/store-location.model';

@Component({
  selector: 'ish-store-address',
  templateUrl: './store-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreAddressComponent {
  @Input() store: StoreModel;
}
