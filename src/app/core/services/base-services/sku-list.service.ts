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
    return !!_.find(this.getValue(), (item) => item === sku);
  }

  addSKU(sku: string): void {
    const list = this.getValue() || [];
    list.push(sku);
    this.next(list);
  }

  removeSKU(sku: string): void {
    if (!!this.getValue()) {
      const list = this.getValue().filter(value => value !== sku);
      this.next(list);
    }
  }
}
