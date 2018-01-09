// NEEDS_WORK: not yet getting the preferred wishlist
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { filter, map, mergeAll } from 'rxjs/operators';
import { WishlistFactory } from '../../../models/wishlist/wishlist.factory';
import { WishlistData } from '../../../models/wishlist/wishlist.interface';
import { Wishlist } from '../../../models/wishlist/wishlist.model';
import { ApiService } from '../../services/api.service';
import { AccountLoginService } from '../account-login/account-login.service';
import { GlobalStateAwareService } from '../base-services/global-state-aware.service';

@Injectable()
export class WishlistsService extends GlobalStateAwareService<Wishlist> {

  baseUrl = 'customers/-/wishlists/';

  constructor(
    @Inject(PLATFORM_ID) platformId,
    private apiService: ApiService,
    private accountLoginService: AccountLoginService
  ) {
    super(platformId, 'wishlistStatus', true, false);
    accountLoginService.subscribe(() => this.updateState(accountLoginService));
  }

  update() {
    this.updateState(this.accountLoginService);
  }

  private updateState(service: AccountLoginService) {
    if (service.isAuthorized()) {
      this.retrieveWishlistFromServer();
    } else {
      this.next(null);
    }
  }

  private retrieveWishlistFromServer() {
    const wishlistBlob$ = this.apiService.get<any>(this.baseUrl);
    const wishlists$: Observable<Wishlist> = wishlistBlob$.pipe(
      filter(data => !!data.elements && data.elements.length > 0),
      map(data => data.elements[0].uri.substring(data.elements[0].uri.lastIndexOf('/') + 1)),
      filter(preferredWishlistUrl => (!!preferredWishlistUrl)),
      map(url => this.getWishlistByUrl(this.baseUrl + url)),
      mergeAll()
    ) as Observable<Wishlist>;

    wishlists$.subscribe(wishlist => {
      this.next((wishlist));
    });
  }

  private getWishlistByUrl(url: string): Observable<Wishlist> {
    return this.apiService.get<WishlistData>(url)
      .map(wishlistData => WishlistFactory.fromData(wishlistData));
  }
}

