import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LARGE_BREAKPOINT_WIDTH, SMALL_BREAKPOINT_WIDTH } from '../../../configurations/injection-keys';

@Component({
  selector: 'ish-header-sticky',
  templateUrl: './header-sticky.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderStickyComponent implements OnInit, OnDestroy {
  stickyHeader: boolean;
  navbarCollapsed = true;
  isMobile: boolean;
  screenHeight: number;
  showSearch = false;
  destroy$ = new Subject();

  mobileStickyHeaderHeight = 40;

  constructor(
    @Inject(SMALL_BREAKPOINT_WIDTH) private mobileWidth: number,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: number,
    @Inject(PLATFORM_ID) private platformId: string,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.resize({ target: window });
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.navbarCollapsed = window.innerWidth < this.largeBreakpointWidth;
    }

    // collapse mobile menu on router navigation start event
    // TODO: check testing and router subscription vs. ngrx state handling
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId) && window.innerWidth < this.largeBreakpointWidth) {
          this.navbarCollapsed = true;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
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
