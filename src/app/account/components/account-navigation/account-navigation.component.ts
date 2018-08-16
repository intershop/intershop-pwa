import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { LARGE_BREAKPOINT_WIDTH } from '../../../core/configurations/injection-keys';

@Component({
  selector: 'ish-account-navigation',
  templateUrl: './account-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountNavigationComponent implements OnInit {
  isMobileView = false;
  currentPath: string;

  /**
   * Manages the Account Navigation items.
   */
  navigationItems: { link: string; localizationKey: string; feature?: string }[] = [
    { link: '/account/overview', localizationKey: 'account.my_account.link' },
    { link: '/account/orders', localizationKey: 'account.order_history.link' },
    { link: '/account/profile', localizationKey: 'account.profile.link' },
    { link: '/account/quote-list', localizationKey: 'account.navigation.quotes.link', feature: 'quoting' },
    { link: '/logout', localizationKey: 'account.navigation.logout.link' },
  ];

  constructor(
    private router: Router,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: number,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileView = window.innerWidth < this.largeBreakpointWidth;
    }
    this.currentPath = location.pathname;
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.isMobileView = event.target.innerWidth < this.largeBreakpointWidth;
  }

  navigateTo(link) {
    if (!!link) {
      this.router.navigate([link]);
    }
  }
}
