import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-category-categories',
  templateUrl: './category-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCategoriesComponent implements OnInit, OnChanges {
  @Input() category: CategoryView;
  @Input() deviceType: DeviceType;

  isCollapsed = false;

  ngOnInit() {
    this.isCollapsed = this.deviceType === 'mobile';
  }

  ngOnChanges() {
    if (!SSR) {
      window.scroll(0, 0);
    }
    this.isCollapsed = this.deviceType === 'mobile';
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    if (!SSR) {
      window.scroll(0, 0);
    }
  }
}
