import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-category-products',
  templateUrl: './category-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryProductsComponent implements OnInit, OnChanges {
  /**
   * The the category leading to the displayed result.
   */
  @Input() category: CategoryView;
  @Input() deviceType: DeviceType;

  isCollapsed = false;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  ngOnInit() {
    this.isCollapsed = this.deviceType === 'mobile';
  }

  ngOnChanges() {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
    this.isCollapsed = this.deviceType === 'mobile';
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
    }
  }
}
