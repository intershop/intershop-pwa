import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Category } from './category';
import { MOCK_CATEGORIES } from './mock-categories';

@Injectable()
export class CategoriesService {

  private categoriesUrl = 'https://localhost:4443/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-/categories';  // real Intershop REST call
  //private categoriesUrl = 'api/categories';  // URL to web api

  constructor(private http: Http) {}

  getCategories(): Promise<Category[]> {
  return this.http.get(this.categoriesUrl)
             .toPromise()
             .then(response => {
               console.log(response.json().elements); 
               return response.json().elements as Category[];
              })
             .catch(this.handleError);
  }

  getCategory(id: string): Promise<Category> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Category)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.resolve(MOCK_CATEGORIES);
  }

}
