import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';

import { MEDIUM_BREAKPOINT_WIDTH } from '../../../../core/configurations/injection-keys';
import { CategoryView } from '../../../../models/category-view/category-view.model';

@Component({
  selector: 'ish-family-page',
  templateUrl: './family-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyPageComponent implements OnInit {
  /**
   * The the category leading to the displayed result.
   */
  @Input()
  category: CategoryView;

  /**
   * Request from the product-list to retrieve more products.
   */
  @Output()
  loadMore = new EventEmitter<void>();

  isCollapsed = false;

  constructor(
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isCollapsed = window.innerWidth < this.mediumBreakpointWidth;
    }
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.isCollapsed = event.target.innerWidth < this.mediumBreakpointWidth;
  }
}
