import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-category-categories',
  standalone: false,
  templateUrl: './category-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCategoriesComponent implements OnInit, OnChanges {
  @Input({ required: true }) category: CategoryView;
  @Input() deviceType: DeviceType;

  isCollapsed = false;

  constructor(private scroller: ViewportScroller) {}

  ngOnInit() {
    this.isCollapsed = this.deviceType === 'mobile';
  }

  ngOnChanges() {
    this.scroller.scrollToPosition([0, 0]);
    this.isCollapsed = this.deviceType === 'mobile';
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.scroller.scrollToPosition([0, 0]);
  }
}
