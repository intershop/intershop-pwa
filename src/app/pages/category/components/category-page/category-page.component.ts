import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageComponent implements OnInit, OnChanges {
  @Input() category: CategoryView;
  @Input() deviceType: DeviceType;

  isCollapsed = false;

  ngOnInit() {
    this.isCollapsed = this.deviceType === 'mobile';
  }

  ngOnChanges() {
    this.isCollapsed = this.deviceType === 'mobile';
  }
}
