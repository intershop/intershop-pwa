import { Injectable } from '@angular/core';
import { ApiService, GlobalState } from '../../services';
import { WishListModel } from './wishlists.model';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class WishListService {

    baseUrl = 'customers/-/wishlists/';
    private preferredWishListUrl: string;


    /**
     * Decides the service to be used as per environment variable
     * @param  {ApiService} private apiService
     */
    constructor(private apiService: ApiService, private globalState: GlobalState) {
    }

    /**
      * @returns wishlist as observable
      */
    getWishList(): Observable<WishListModel> {
        // TODO:check empty data
        if (environment.needMock) {
            const wishListMock = new WishListModel();
            wishListMock.itemsCount = 3;
            this.globalState.notifyDataChanged('wishListStatus', wishListMock);
            return Observable.of(wishListMock);

        }
        return this.apiService.get(this.baseUrl)
            .do(data => {
                this.preferredWishListUrl = (data.elements && data.elements.length > 0) ?
                    data.elements[0].uri.substring(data.elements[0].uri.lastIndexOf('/') + 1) : null;
            })
            .flatMap(u =>
                this.getPreferredWishList(this.preferredWishListUrl)
            );
    }

    /**
     * @returns wishlist as observable
     * @param  string url
     */
    getPreferredWishList(url: string): Observable<any> {
        if (url) {
            return this.apiService.get(this.baseUrl + url)
                .map((data) => {
                    this.globalState.notifyDataChanged('wishListStatus', data);
                });
        } else {
            return Observable.of(null);
        }
    }


}

