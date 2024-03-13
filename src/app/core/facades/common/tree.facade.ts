import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { DynamicFlatNode } from 'ish-core/utils/tree/tree.interface';

export const TREE_FACADE_IMPLEMENTOR = new InjectionToken<TreeFacade>('TreeFacadeImplementor');

export interface TreeFacade {
  initialData$(): Observable<DynamicFlatNode[]>;
  getChildren$(node: string): Observable<Omit<DynamicFlatNode, 'level'>[]>;
}
