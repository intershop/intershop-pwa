import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Address } from 'ish-core/models/address/address.model';
import { SelectComponent, SelectOption } from 'ish-shared/forms/components/select/select.component';

/**
 * Select box for the given addresses.
 * if controlName equals 'id' the form control gets the id of the addresses as selected value, otherwise the address urn is taken as value
 */
@Component({
  selector: 'ish-select-address',
  templateUrl: '../select/select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectAddressComponent extends SelectComponent implements OnChanges {
  @Input() addresses: Address[];
  @Input() emptyOptionLabel: string;

  ngOnChanges(c: SimpleChanges) {
    if (c.addresses && this.addresses) {
      this.options = this.mapToOptions(this.addresses);
    }
  }

  private mapToOptions(addresses: Address[]): SelectOption[] {
    return addresses.map((a: Address) => ({
      label: `${a.firstName} ${a.lastName}, ${a.addressLine1}, ${a.city}`,
      value: this.controlName === 'id' ? a.id : a.urn,
    }));
  }
}
