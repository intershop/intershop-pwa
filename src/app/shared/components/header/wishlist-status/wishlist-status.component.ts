import { Component, OnInit, Input } from '@angular/core';
import { DataEmitterService } from '../../../services/data-emitter.service';
import { AccountLoginService } from '../../../../pages/account-login/account-login-service';
import { CacheCustomService } from '../../../../shared/services';

@Component({
  selector: 'is-wishlist-status',
  templateUrl: './wishlist-status.component.html'
})
export class WishListComponent implements OnInit {
  wishListItems = [];
  itemCount = 0;
  isLoggedIn;
  constructor(private _dataEmitterService: DataEmitterService, private accountLoginService: AccountLoginService,
    private cacheService: CacheCustomService
  ) {
  }

  ngOnInit() {

    this.isLoggedIn = this.cacheService.cacheKeyExists('userDetail');

    this._dataEmitterService.wishListEmitter.subscribe(data => {
      this.wishListItems.push(data);
    });

    this.accountLoginService.loginStatusEmitter.subscribe((userDetailData) => {
      this.isLoggedIn = true;
    })
  }
};

