import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../services';
import { AccountLoginService } from '../account-login/account-login.service';
import { GlobalStateAwareService } from '../base-services/global-state-aware-service';
import { WishListModel } from './wishlists.model';

@Injectable()
export class WishListService {

  baseUrl = 'customers/-/wishlists/';

  private wishListShareService: GlobalStateAwareService<WishListModel>;

  constructor(private apiService: ApiService, private accountLoginService: AccountLoginService) {
    this.wishListShareService = new GlobalStateAwareService<WishListModel>('wishListStatus', true, false);
    accountLoginService.subscribe(this.update);
  }

  update = () => {
    if (this.accountLoginService.isAuthorized()) {
      this.retrieveWishListFromServer();
    } else {
      this.wishListShareService.next(null);
    }
  }

  subscribe(callback: (model: WishListModel) => void) {
    this.wishListShareService.subscribe(callback);
  }

  private retrieveWishListFromServer() {
    // TODO:check empty data
    if (environment.needMock) {
      const wishListMock = new WishListModel();
      wishListMock.itemsCount = 3;
      this.wishListShareService.next(wishListMock);
    }
    this.apiService.get(this.baseUrl).subscribe(data => {
        const preferredWishListUrl = (!!data.elements && data.elements.length > 0) ?
          data.elements[0].uri.substring(data.elements[0].uri.lastIndexOf('/') + 1) : null;
        if (!!preferredWishListUrl) {
          this.apiService.get(this.baseUrl + preferredWishListUrl).subscribe((data2) => {
            this.wishListShareService.next(data2);
          });
        }
      });
  }
}

