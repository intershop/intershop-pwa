import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Store as StoreModel } from '../../models/store/store.model';

@Component({
  selector: 'ish-store-address',
  templateUrl: './store-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreAddressComponent {
  @Input() store: StoreModel;
}
