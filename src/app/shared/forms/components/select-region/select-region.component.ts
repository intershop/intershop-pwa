import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Region } from 'ish-core/models/region/region.model';
import { SelectComponent, SelectOption } from 'ish-shared/forms/components/select/select.component';

@Component({
  selector: 'ish-select-region',
  templateUrl: '../select/select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectRegionComponent extends SelectComponent implements OnChanges {
  @Input() regions: Region[];
  @Input() controlName = 'state';
  @Input() label = 'account.default_address.state.label';
  @Input() errorMessages = { required: 'account.address.state.error.default' };

  ngOnChanges(c: SimpleChanges) {
    if (c.regions) {
      this.options = this.mapToOptions(this.regions);
    }
  }

  private mapToOptions(regions: Region[]): SelectOption[] {
    if (!regions) {
      return;
    }
    return regions.map(r => ({
      label: r.name,
      value: r.regionCode,
    }));
  }
}
