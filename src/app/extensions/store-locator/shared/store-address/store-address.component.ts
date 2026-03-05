import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StoreLocation as StoreModel } from '../../models/store-location/store-location.model';

@Component({
  selector: 'ish-store-address',
  templateUrl: './store-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf],
})
export class StoreAddressComponent {
  @Input({ required: true }) store: StoreModel;
}
