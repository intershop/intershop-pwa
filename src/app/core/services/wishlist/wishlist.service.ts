import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { WishlistData } from 'ish-core/models/wishlist/wishlist.interface';
import { WishlistMapper } from 'ish-core/models/wishlist/wishlist.mapper';
import { Wishlist } from 'ish-core/models/wishlist/wishlist.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  constructor(private apiService: ApiService, private wishlistMapper: WishlistMapper) {}

  getWishlist(wishlistId: string, owner: string, secureCode: string): Observable<Wishlist> {
    return this.apiService
      .get<WishlistData>(`wishlists/${wishlistId};owner=${owner};secureCode=${secureCode}`)
      .pipe(map(wishlist => this.wishlistMapper.fromData(wishlist, wishlistId)));
  }
}
