import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie';
import { GlobalStateAwareService } from './global-state-aware.service';

export abstract class SKUListService extends GlobalStateAwareService<string[]> {

  constructor(
    name: string, persistInSession: boolean,
    cookieService?: CookieService
  ) {
    super(name, true, persistInSession, [], cookieService);
  }

  containsSKU(sku: string): boolean {
    return !!_.find(this.value, (item) => item === sku);
  }

  addSKU(sku: string): void {
    const list = this.value || [];
    list.push(sku);
    this.next(list);
  }

  removeSKU(sku: string): void {
    if (!!this.value) {
      const list = this.value.filter(value => value !== sku);
      this.next(list);
    }
  }
}
