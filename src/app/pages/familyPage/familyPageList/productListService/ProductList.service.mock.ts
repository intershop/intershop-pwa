import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { ProductList } from "app/pages/familyPage/familyPage.mock";
import { IProductListService } from "app/pages/familyPage/familyPageList/productListService/ProductList.service";


@Injectable()
export class ProductListMockService implements IProductListService {
    
    /**
     * @returns Products to be displayed as Observable
     */
    getProductList(): Observable<any> {
        return Observable.of(ProductList);
    }

}


