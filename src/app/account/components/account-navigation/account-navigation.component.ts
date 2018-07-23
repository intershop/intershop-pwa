import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const MOBILE_VIEW_WIDTH = 992;

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.isMobileView = window.innerWidth < MOBILE_VIEW_WIDTH;
    this.currentPath = location.pathname;
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.isMobileView = event.target.innerWidth < MOBILE_VIEW_WIDTH;
  }

  navigateTo(link) {
    if (!!link) {
      this.router.navigate([link]);
    }
  }
}
