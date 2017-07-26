import { ProductTileMockData } from '../productTile.mock';
import { ProductTileModel } from './productTile.model';
import { Observable } from 'rxjs/Observable';

export class ProductTileService {
    public static getProductTile(): Observable<ProductTileModel> {
        return Observable.of(ProductTileMockData);
    }
}
