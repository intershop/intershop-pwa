import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { NotRoleToggleDirective } from 'ish-core/directives/not-role-toggle.directive';
import { FeatureToggleType } from 'ish-core/feature-toggle';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

import { AccountUserInfoComponent } from '../account-user-info/account-user-info.component';

import { navigationItems } from './account-navigation.items';

export interface NavigationItem {
  id: string;
  localizationKey: string;
  routerLink?: string;
  icon?: string;
  isCollapsed?: boolean;
  feature?: FeatureToggleType;
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
  standalone: true,
  imports: [
    AccountUserInfoComponent,
    AuthorizationToggleDirective,
    FeatureTogglePipe,
    NgbCollapse,
    NotRoleToggleDirective,
    RouterLink,
    RouterLinkActive,
    ServerSettingPipe,
    TranslatePipe,
  ],
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
