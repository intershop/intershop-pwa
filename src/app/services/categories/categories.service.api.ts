import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Category } from './category.model';
import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Injectable()
export class CategoriesApiService {
  constructor(private apiService: ApiService) { }
  /**
   * returns list of categories
   * @returns Observable
   */
  public getCategories(uri: string): Observable<Category[]> {
    return this.apiService.get(uri, null, null, true);
  }
}




