import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';

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

  isCollapsed = false;

  ngOnInit() {
    this.isCollapsed = this.deviceType === 'mobile';
  }

  ngOnChanges() {
    window.scroll(0, 0);
    this.isCollapsed = this.deviceType === 'mobile';
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    window.scroll(0, 0);
  }
}
