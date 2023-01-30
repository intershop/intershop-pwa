import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { navigationItems } from './account-navigation.items';

interface NavigationItem {
  localizationKey: string;
  dataTestingId?: string;
  feature?: string;
  serverSetting?: string;
  permission?: string | string[];
  notRole?: string | string[];
  faIcon?: IconProp;
  isCollapsed?: boolean;
  children?: NavigationItems;
}

export interface NavigationItems {
  [link: string]: NavigationItem;
}

@Component({
  selector: 'ish-account-navigation',
  templateUrl: './account-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountNavigationComponent {
  @Input() deviceType: DeviceType;

  /**
   * Manages the Account Navigation items.
   */
  navigationItems: NavigationItems = navigationItems;

  constructor(private router: Router) {}

  toggleCollapse(item: NavigationItem) {
    item.isCollapsed = !item.isCollapsed;
  }

  navigateTo(target: EventTarget) {
    if (target) {
      this.router.navigateByUrl((target as HTMLDataElement).value);
    }
  }

  get unsorted() {
    return () => 0;
  }

  isSelected(itemValueLink: string): string {
    return itemValueLink === location.pathname ? 'selected' : undefined;
  }
}
