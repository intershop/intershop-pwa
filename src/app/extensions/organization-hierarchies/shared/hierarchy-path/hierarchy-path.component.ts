import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Group } from 'ish-core/models/group/group.model';
import { Order } from 'ish-core/models/order/order.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-hierarchy-path',
  templateUrl: './hierarchy-path.component.html',
  styleUrls: ['hierarchy-path.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class HierarchyPathComponent implements OnInit {
  @Input() object: Basket | Order;

  path: Group[];
  leaf: string;
  root: string;
  pathElements: Group[] = [];

  ngOnInit(): void {
    this.preparePath();
  }

  private preparePath(): void {
    if (this.object) {
      this.path = this.object.buyingContextInfo.groupPath;

      if (this.path) {
        this.leaf = this.path[this.path.length - 1].groupName;
        this.root = this.path[0].groupName;

        if (this.path.length > 2) {
          this.pathElements = this.path.slice(1, this.path.length - 1);
        }
      }
    }
  }
}
