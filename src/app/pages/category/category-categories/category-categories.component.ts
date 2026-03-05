import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';
import { PaymentPaypalMessagesComponent } from 'ish-shared/components/checkout/payment-paypal-messages/payment-paypal-messages.component';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';

import { CategoryListComponent } from '../category-list/category-list.component';
import { CategoryNavigationComponent } from '../category-navigation/category-navigation.component';

@Component({
  selector: 'ish-category-categories',
  templateUrl: './category-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslateModule,
    NgbCollapseModule,
    SkipContentLinkComponent,
    BreadcrumbComponent,
    CategoryListComponent,
    CategoryNavigationComponent,
    NgIf,
    PaymentPaypalMessagesComponent,
    ServerSettingPipe,
    ContentViewcontextComponent,
  ],
})
export class CategoryCategoriesComponent implements OnInit, OnChanges {
  @Input({ required: true }) category: CategoryView;
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
