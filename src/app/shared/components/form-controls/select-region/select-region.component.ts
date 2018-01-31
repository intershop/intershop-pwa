import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Region } from '../../../../models/region/region.model';
import { SelectOption } from '../select/select-option.interface';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'ish-select-region',
  templateUrl: './select-region.component.html'
})
export class SelectRegionComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() regions: Region[];
  @Input() controlName = 'state';
  @Input() label = 'State/Province';
  @Input() errorMessages = { 'required': 'Please select a region' };  // ToDo: Translation key

  options: SelectOption[] = [];

  ngOnChanges(c: SimpleChanges) {
    if (c.regions) {
      this.options = this.mapToOptions(this.regions);
    }
  }

  private mapToOptions(regions: Region[]): SelectOption[] {
    if (!regions) { return; }
    return regions.map(r => ({
      label: r.name,
      value: r.regionCode
    } as SelectOption));
  }
}
