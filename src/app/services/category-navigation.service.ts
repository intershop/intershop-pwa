import { Injectable } from '@angular/core';
import { GlobalStateAwareService } from './base-services/global-state-aware.service';

@Injectable()
export class CategoryNavigationService extends GlobalStateAwareService<string> {

    constructor() {
        super('categoryText', false, false);
    }

    setCategory(category: string) {
        this.next(category);
    }
}
