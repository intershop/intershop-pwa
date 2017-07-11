import { Observable } from 'rxjs/Rx'
import {Injectable} from '@angular/core'
import { ApiService } from "app/shared/services";
import { IProductListService } from "app/pages/familyPage/familyPageList/productListService/ProductList.service";

@Injectable()
export class ProductListApiService implements IProductListService {
    apiService;
    constructor(apiService: ApiService) {
        this.apiService = apiService;
     }
    /**
     * @returns Products to be displayed as Observable
     */
    getProductList(): Observable<any> {
        return this.apiService.get("url");
    }
}