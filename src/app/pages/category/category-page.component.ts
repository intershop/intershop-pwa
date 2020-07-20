import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageComponent implements OnInit {
  category$: Observable<CategoryView>;
  deviceType$: Observable<DeviceType>;

  constructor(private shoppingFacade: ShoppingFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.category$ = this.shoppingFacade.selectedCategory$;
    this.deviceType$ = this.appFacade.deviceType$;
  }
}
