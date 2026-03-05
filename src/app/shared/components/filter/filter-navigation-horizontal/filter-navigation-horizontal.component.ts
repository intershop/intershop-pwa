import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';
import { FilterDropdownComponent } from 'ish-shared/components/filter/filter-dropdown/filter-dropdown.component';

@Component({
  selector: 'ish-filter-navigation-horizontal',
  templateUrl: './filter-navigation-horizontal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, NgIf, TranslatePipe, FilterDropdownComponent],
})
export class FilterNavigationHorizontalComponent {
  @Input({ required: true }) filterNavigation: FilterNavigation;
  @Output() readonly applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();
}
