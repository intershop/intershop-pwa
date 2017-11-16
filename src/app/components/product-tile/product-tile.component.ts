import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DisableIconDirective } from '../../directives/disable-icon.directive';
import { AccountLoginService } from '../../services/account-login/account-login.service';
import { CartStatusService } from '../../services/cart-status/cart-status.service';
import { ProductCompareService } from '../../services/product-compare/product-compare.service';
import { Product } from '../../services/products/products.model';
import { ICM_BASE_URL } from '../../services/state-transfer/factories';
import { WishListService } from '../../services/wishlists/wishlists.service';


@Component({
  selector: 'is-product-tile',
  templateUrl: './product-tile.component.html',
})

export class ProductTileComponent implements OnInit {
  @Input() mockData: Product;
  finalPrice = 1;
  greaterPrice = 0;
  displayCondition: boolean;
  oldPrice: any;
  shownSavings: number;
  @ViewChild(DisableIconDirective) disableIconDirective: DisableIconDirective = null;

  constructor(
    private accountLoginService: AccountLoginService,
    private wishListService: WishListService,
    private productCompareService: ProductCompareService,
    private cartStatusService: CartStatusService,
    private router: Router,
    @Inject(ICM_BASE_URL) public icmBaseURL
  ) {
  }

  ngOnInit() {

    this.mockData['enableExpressShop'] = true;
    this.mockData['richSnippetsEnabled'] = true;
    this.mockData['ShowProductRating'] = true;
    this.mockData['showAddToCart'] = true;
    this.mockData['totalRatingCount'] = 2;
    this.mockData['simpleRatingView'] = true;
    this.mockData['averagRating'] = 2;
    this.mockData['isRetailSet'] = true;
    this.mockData['displayType'] = 'glyphicon';
    this.mockData['applicablePromotions'] = [
      {
        'disableMessages': true,
        'isUnderABTest': true,
        'title': 'Promotion Test Title',
        'icon': 'test',
        'externalDetailsUrl': 'www.testUrl.com'
      },
      {
        'disableMessages': true,
        'isUnderABTest': true,
        'title': 'Promotion Test Title',
        'icon': 'test',
        'externalDetailsUrl': 'www.testUrl.com'
      }
    ];
    this.mockData['name_override'] = 'Test_override';
    this.mockData['mockListView'] = {
      'displayType': 'test',
      'isRetailSet': false
    };
    this.mockData['showInformationalPrice'] = true;
    this.mockData['isEndOfLife'] = true;
    this.mockData['id'] = '1';
    this.mockData['averageRatingClass'] = '';
    this.mockData['isProductMaster'] = true;
    // this.mockData.listPrice['range'] = {
    //   'minimumPrice': 110,
    //   'maximumPrice': 380
    // };

    // this.calculatePriceParameters();
    this.calculateAverageRating();
  }

  /**
   * Calculates Average Rating
   * @returns void
   */
  calculateAverageRating(): void {
    if (this.mockData.averagRating >= 0.5 && this.mockData.averagRating < 1.5) {
      this.mockData.averageRatingClass = 'rating-one';
    } else if (this.mockData.averagRating >= 1.5 && this.mockData.averagRating < 2.5) {
      this.mockData.averageRatingClass = 'rating-two';
    } else if (this.mockData.averagRating >= 2.5 && this.mockData.averagRating < 3.5) {
      this.mockData.averageRatingClass = 'rating-three';
    } else if (this.mockData.averagRating >= 3.5 && this.mockData.averagRating < 4.5) {
      this.mockData.averageRatingClass = 'rating-four';
    } else if (this.mockData.averagRating >= 4.5) {
      this.mockData.averageRatingClass = 'rating-five';
    } else {
      this.mockData.averageRatingClass = '';
    }
  }

  /**
   * Calculates old price, Savings
   *@returns void
   */
  calculatePriceParameters(): void {
    if (this.mockData.showInformationalPrice && !this.mockData.isEndOfLife) {
      this.greaterPrice = 1;
      if (this.mockData.listPrice.value) {
        if (this.mockData.listPrice.value > this.mockData.salePrice.value) {
          this.finalPrice = 0;
          this.greaterPrice = 0;
        }
      }
    }

    if (this.mockData.listPrice.value) {
      this.displayCondition = true;
      if (this.mockData.salePrice.value && !(this.mockData.listPrice.value > this.mockData.salePrice.value)) {
        this.displayCondition = false;
      }
    }


    if (this.mockData.listPrice.range && !(this.mockData.listPrice.range.minimumPrice === this.mockData.listPrice.range.maximumPrice)) {
      this.oldPrice = this.mockData.listPrice.range.maximumPrice - this.mockData.listPrice.range.minimumPrice;
    } else if (this.mockData.listPrice.value) {
      // isProductMaster not available on API mockData
      if (this.mockData.isProductMaster) {
        this.oldPrice = String(this.mockData.listPrice.range.minimumPrice);
      } else {
        this.oldPrice = String(this.mockData.listPrice.value);
      }
    } else {
      this.oldPrice = 'N/A';
    }

    // To calculate savings
    /* if( this.mockData.showPriceSavings && this.mockData.listPrice.value && (this.mockData.salePrice < this.mockData.listPrice )){
         let actualPriceTypeSavings =  this.mockData.listPrice.value - this.mockData.salePrice;
         if(!this.mockData.savings){
            this.shownSavings = actualPriceTypeSavings;
         } else {
              if(this.mockData?.savings < actualPriceTypeSavings){
                this.shownSavings = actualPriceTypeSavings;
              }
         }
    } */
  }

  /**
   * Adds product to cart
   */
  addToCart(): void {
    this.cartStatusService.addSKU(this.mockData.sku);
  }

  /**
   * Adds product to wishlist
   */
  addToWishList(): void {
    if (!this.accountLoginService.isAuthorized()) {
      this.router.navigate(['/login']);
    } else {
      this.wishListService.update();
    }
  }

  /**
   * Adds product to comparison
   */
  addToCompare(): void {
    if (this.productCompareService.containsSKU(this.mockData.sku)) {
      this.productCompareService.removeSKU(this.mockData.sku);
    } else {
      this.productCompareService.addSKU(this.mockData.sku);
    }
  }
}
