import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';
import { FilterCheckboxComponent } from 'ish-shared/components/filter/filter-checkbox/filter-checkbox.component';
import { FilterCollapsibleComponent } from 'ish-shared/components/filter/filter-collapsible/filter-collapsible.component';
import { FilterDropdownComponent } from 'ish-shared/components/filter/filter-dropdown/filter-dropdown.component';
import { FilterSwatchImagesComponent } from 'ish-shared/components/filter/filter-swatch-images/filter-swatch-images.component';
import { FilterTextComponent } from 'ish-shared/components/filter/filter-text/filter-text.component';

@Component({
  selector: 'ish-filter-navigation-sidebar',
  imports: [
    FilterCheckboxComponent,
    FilterCollapsibleComponent,
    FilterDropdownComponent,
    FilterSwatchImagesComponent,
    FilterTextComponent,
  ],
  standalone: true,
  templateUrl: './filter-navigation-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationSidebarComponent {
  @Input({ required: true }) filterNavigation: FilterNavigation;
  @Output() readonly applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();

  /**
   * keeps the collapsed state of sub components when changing filters
   */
  collapsedElements: Record<string, boolean> = {};

  /**
   * keeps the show all state of sub components when changing filters
   */
  showAllElements: Record<string, boolean> = {};
}
