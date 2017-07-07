import { Injectable } from '@angular/core'
import { ApiService } from "app/shared/services";
import { environment } from "environments/environment";
import { IProductListService } from "app/pages/familyPage/familyPageList/productListService/iProductList.service";
import { ProductListMockService } from "app/pages/familyPage/familyPageList/productListService/ProductList.service.mock";
import { ProductListApiService } from "app/pages/familyPage/familyPageList/productListService/ProductList.service.api";

@Injectable()
export class ProductListService {
    serviceObj: IProductListService;
    apiService: ApiService

    deciderFunction() {
        if (environment.needMock) {
            return this.serviceObj = new ProductListMockService();
        }
        else {
            return this.serviceObj = new ProductListApiService(this.apiService);
        }
    }
}