import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-family-page',
  templateUrl: './family-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FamilyPageComponent implements OnInit, OnChanges {
  /**
   * The the category leading to the displayed result.
   */
  @Input() category: CategoryView;
  @Input() deviceType: DeviceType;

  /**
   * Request from the product-list to retrieve more products.
   */
  @Output() loadMore = new EventEmitter<void>();

  isCollapsed = false;

  ngOnInit() {
    this.isCollapsed = this.deviceType === 'mobile';
  }

  ngOnChanges() {
    this.isCollapsed = this.deviceType === 'mobile';
  }
}
