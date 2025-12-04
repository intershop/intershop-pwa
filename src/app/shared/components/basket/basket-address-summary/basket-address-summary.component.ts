import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'ish-core/icon.module';

import { Basket } from 'ish-core/models/basket/basket.model';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';

@Component({
  selector: 'ish-basket-address-summary',
  templateUrl: './basket-address-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, TranslateModule, IconModule, AddressComponent],
})
export class BasketAddressSummaryComponent {
  @Input({ required: true }) basket: Basket;
}
