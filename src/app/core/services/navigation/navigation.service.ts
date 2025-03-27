import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';

@Injectable({ providedIn: 'root' })
export abstract class NavigationService {
  abstract getTopLevelCategories(limit: number): Observable<CategoryTree>;
}
