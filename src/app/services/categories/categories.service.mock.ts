import { Observable } from 'rxjs/Observable';
import { CategoriesMock } from './categories.mock';
import 'rxjs/add/operator/map';
import { Category } from './category.model';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoriesMockService {

  /**
     * returns list of categories
     * @returns Observable
  */
  public getCategories(uri: string): Observable<Category[]> {
    return Observable.of(CategoriesMock.elements);
  }
}




