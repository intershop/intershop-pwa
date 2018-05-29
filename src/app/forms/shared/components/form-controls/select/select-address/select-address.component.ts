import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Address } from '../../../../../../models/address/address.model';
import { SelectOption } from '../select-option.interface';
import { SelectComponent } from '../select.component';

@Component({
  selector: 'ish-select-address',
  templateUrl: '../select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectAddressComponent extends SelectComponent implements OnChanges {
  @Input() addresses: Address[];
  @Input() emptyOptionLabel: string;

  ngOnChanges(c: SimpleChanges) {
    if (c.addresses) {
      this.options = this.mapToOptions(this.addresses);
    }
  }

  private mapToOptions(addresses: Address[]): SelectOption[] {
    return addresses.map(
      (a: Address) =>
        ({
          label: `${a.firstName} ${a.lastName}, ${a.addressLine1}, ${a.city}`,
          value: a.id,
        } as SelectOption)
    );
  }
}
