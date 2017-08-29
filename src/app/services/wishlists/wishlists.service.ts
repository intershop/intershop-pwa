import { Injectable } from '@angular/core';
import { ApiService, GlobalState } from 'app/services';
import { WishListModel } from './wishlists.model';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

@Injectable()
export class WishListService {

    baseUrl: string = 'customers/-/wishlists/';
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
            let wishListMock = new WishListModel();
            wishListMock.itemsCount = 3;
            this.globalState.notifyDataChanged('wishListStatus', wishListMock);
            return Observable.of(wishListMock);

        }
        return this.apiService.get(this.baseUrl)
            .do(data => {
                this.preferredWishListUrl = data.elements[0].uri.substring(data.elements[0].uri.lastIndexOf('/') + 1)
            })
            .flatMap(u => this.getPreferredWishList(this.preferredWishListUrl));
    }

    /**
     * @returns wishlist as observable
     */
    getPreferredWishList(url: string): Observable<any> {
        return this.apiService.get(this.baseUrl + url)
            .map((data) => {
                this.globalState.notifyDataChanged('wishListStatus', data);
            })
    }
}

