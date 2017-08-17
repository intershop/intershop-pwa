import { Component, Input, OnInit } from '@angular/core';
import { DataEmitterService } from '../../services/data-emitter.service';
import { ProductTileModel } from './product-tile.model';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'is-producttile',
  templateUrl: './product-tile.component.html',
  styles: [`
   .product-list-item.grid-view:nth-child(2n+1) {
      clear: none;
    }
  `]
})

export class ProductTileComponent implements OnInit {
  @Input() mockData: ProductTileModel;
  @Input() isListView: false;
  finalPrice: number = 1;
  greaterPrice: number = 0;
  displayCondition: boolean;
  oldPrice: any;
  shownSavings: number;

  /**
   * Constructor
   * @param  {DataEmitterService} private_dataEmitterService
   */
  constructor(private _dataEmitterService: DataEmitterService) {
  }

  ngOnInit() {
    if (!environment.needMock) {
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
      this.mockData.listPrice['range'] = {
        'minimumPrice': 110,
        'maximumPrice': 380
      };
      this.mockData.images[2].effectiveUrl = environment.base_url + this.mockData.images[2].effectiveUrl;
      this.mockData.images[0].effectiveUrl = environment.base_url + this.mockData.images[0].effectiveUrl;
    }
    this.calculatePriceParameters();
    this.calculateAverageRating();

  };

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
  };

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
  };


  /**
   * Adds product to cart
   * @param  {} itemToAdd
   * @returns void
   */
  addToCart(itemToAdd): void {
    this._dataEmitterService.addToCart(itemToAdd);
  };

  /**
   * Adds product to wishlist
   * @param  {} itemToAdd
   * @returns void
   */
  addToWishList(itemToAdd): void {
    this._dataEmitterService.addToWishList(itemToAdd);
  };

  /**
   * Adds product to comparison
   * @param  {} itemToAdd
   * @returns void
   */
  addToCompare(itemToAdd): void {
    this._dataEmitterService.addToCompare(itemToAdd);
  };
};
