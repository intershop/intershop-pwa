import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { navigationItems } from './account-navigation.items';

export interface NavigationItem {
  id: string;
  localizationKey: string;
  routerLink?: string;
  faIcon?: IconProp;
  isCollapsed?: boolean;
  feature?: string;
  serverSetting?: string;
  permission?: string | string[];
  notRole?: string | string[];
  children?: NavigationItem[];
}

/**
 * The account navigation component displays the items of the account navigation menu. The navigation items are defined in the account-navigation.items.<theme>.ts or account-navigation.items.ts, respectively.
 */
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
  navItems: NavigationItem[] = navigationItems;

  activeClass = 'active';

  constructor(private router: Router) {}

  activeChanged(active: boolean, activeItem: NavigationItem) {
    if (active && activeItem) {
      const parentItem = this.navItems.find(item => item.children?.find(subitem => subitem.id === activeItem?.id));
      if (parentItem) {
        parentItem.isCollapsed = false;
      }
    }
  }

  toggleCollapse(item: NavigationItem) {
    item.isCollapsed = !item.isCollapsed;
  }

  isSelected(item: NavigationItem): string {
    return item.routerLink === location.pathname ? 'selected' : undefined;
  }

  navigateTo(target: EventTarget) {
    if (target) {
      this.router.navigateByUrl((target as HTMLDataElement).value);
    }
  }
}
