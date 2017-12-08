// NEEDS_WORK: not yet getting the preferred wishlist
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Wishlist } from '../../../models/wishlist.model';
import { ApiService } from '../../services/api.service';
import { AccountLoginService } from '../account-login/account-login.service';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';

@Injectable()
export class WishListService extends GlobalStateAwareService<Wishlist> {

  baseUrl = 'customers/-/wishlists/';

  constructor(
    @Inject(PLATFORM_ID) platformId,
    private apiService: ApiService,
    private accountLoginService: AccountLoginService
  ) {
    super(platformId, 'wishListStatus', true, false);
    accountLoginService.subscribe(() => this.updateState(accountLoginService));
  }

  update() {
    this.updateState(this.accountLoginService);
  }

  private updateState(service: AccountLoginService) {
    if (service.isAuthorized()) {
      this.retrieveWishListFromServer();
    } else {
      this.next(null);
    }
  }

  private retrieveWishListFromServer() {
    this.apiService.get(this.baseUrl).subscribe(data => {
      const preferredWishListUrl = (!!data.elements && data.elements.length > 0) ?
        data.elements[0].uri.substring(data.elements[0].uri.lastIndexOf('/') + 1) : null;
      if (!!preferredWishListUrl) {
        this.apiService.get(this.baseUrl + preferredWishListUrl).subscribe((data2) => {
          this.next(data2);
        });
      }
    });
  }
}

