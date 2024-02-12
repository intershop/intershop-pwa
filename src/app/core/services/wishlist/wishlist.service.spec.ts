import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { WishlistService } from './wishlist.service';

describe('Wishlist Service', () => {
  let apiServiceMock: ApiService;
  let wishlistService: WishlistService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    wishlistService = TestBed.inject(WishlistService);
  });

  it('should be created', () => {
    expect(wishlistService).toBeTruthy();
  });
});
