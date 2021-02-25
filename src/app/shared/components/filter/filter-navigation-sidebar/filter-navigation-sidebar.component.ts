import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { URLFormParams } from 'ish-core/utils/url-form-params';

@Component({
  selector: 'ish-filter-navigation-sidebar',
  templateUrl: './filter-navigation-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterNavigationSidebarComponent {
  @Input() filterNavigation: FilterNavigation;
  @Output() applyFilter = new EventEmitter<{ searchParameter: URLFormParams }>();

  /**
   * keeps the collapsed state of subcomponents when changing filters
   */
  collapsedElements: { [id: string]: boolean } = {};

  /**
   * keeps the show all state of subcomponents when changing filters
   */
  showAllElements: { [id: string]: boolean } = {};
}
