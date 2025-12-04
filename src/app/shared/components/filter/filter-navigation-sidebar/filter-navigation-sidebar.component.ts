import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';
import { FilterTextComponent } from '../filter-text/filter-text.component';
import { FilterSwatchImagesComponent } from '../filter-swatch-images/filter-swatch-images.component';
import { FilterCheckboxComponent } from '../filter-checkbox/filter-checkbox.component';
import { FilterDropdownComponent } from '../filter-dropdown/filter-dropdown.component';
import { FilterCollapsibleComponent } from '../filter-collapsible/filter-collapsible.component';

@Component({
  selector: 'ish-filter-navigation-sidebar',
  templateUrl: './filter-navigation-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    FilterTextComponent,
    FilterSwatchImagesComponent,
    FilterCheckboxComponent,
    FilterDropdownComponent,
    FilterCollapsibleComponent,
  ],
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
