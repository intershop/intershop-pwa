import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';

import { SMALL_BREAKPOINT_WIDTH } from '../../../configurations/injection-keys';

@Component({
  selector: 'ish-header-sticky',
  templateUrl: './header-sticky.component.html',
})
export class HeaderStickyComponent {
  stickyHeader: boolean;
  navbarCollapsed = true;
  isMobile: boolean;
  screenHeight: number;
  showSearch = false;

  mobileStickyHeaderHeight = 40;

  constructor(
    @Inject(SMALL_BREAKPOINT_WIDTH) private mobileWidth: number,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.resize({ target: window });
    }
  }

  @HostListener('window:scroll')
  scroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.stickyHeader = (this.isMobile ? this.mobileStickyHeaderHeight : 175) < window.pageYOffset;
    }
  }

  @HostListener('window:resize', ['$event'])
  resize(event) {
    this.isMobile = this.mobileWidth > event.target.innerWidth;
    this.screenHeight = event.target.innerHeight - this.mobileStickyHeaderHeight;
    this.scroll();
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }
}
