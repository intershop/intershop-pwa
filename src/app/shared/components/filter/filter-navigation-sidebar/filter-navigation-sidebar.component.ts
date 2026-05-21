import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'ish-filter-navigation-sidebar',
  standalone: false,
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
