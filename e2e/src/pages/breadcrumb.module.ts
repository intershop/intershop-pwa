import { $$ } from 'protractor';

export class BreadcrumbModule {
  get noOfItems() {
    return $$('li.breadcrumbs-list').count();
  }

  getItem(idx: number) {
    return $$('li.breadcrumbs-list').get(idx);
  }
}
