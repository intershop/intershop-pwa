import { Observable } from 'rxjs/Rx'

export interface IProductListService {
    getProductList(): Observable<any>;
}