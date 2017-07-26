import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataEmitterService } from '../../services/dataEmitter.service';
import { ProductTileModel } from './productTileService/productTile.model';
import { ProductTileService } from './productTileService/productTile.service';

@Component({
  selector: 'is-producttile',
  templateUrl: './productTile.component.html',
  styleUrls: ['./productTile.component.css']
})

export class ProductTileComponent implements OnInit {
  @Input() _data: any;
  @Input() isListView: false;
  private productTileService: ProductTileService;
  class1 = 'product-image';

  mockData: ProductTileModel;
  private finalPrice: number = 1;
  private greaterPrice: number = 0;
  private displayCondition: boolean;
  private oldPrice: any;
  private shownSavings: number;

  /**
   * Constructor
   * @param  {Router} privateroute
   * @param  {DataEmitterService} private_dataEmitterService
   */
  constructor(private route: Router, private _dataEmitterService: DataEmitterService) {
  }

  ngOnInit() {
    ProductTileService.getProductTile().subscribe(data => {
      this.mockData = data;
    });
    this.calculatePriceParameters();
  };



  calculateAverageRating(): void {
    if (this.mockData.averagRating >= 0.5 && this.mockData.averagRating < 1.5) {
      this.mockData.averageRatingClass = 'rating-one';
    }
    else if (this.mockData.averagRating >= 1.5 && this.mockData.averagRating < 2.5) {
      this.mockData.averageRatingClass = 'rating-two';
    }
    else if (this.mockData.averagRating >= 2.5 && this.mockData.averagRating < 3.5) {
      this.mockData.averageRatingClass = 'rating-three';
    }
    else if (this.mockData.averagRating >= 3.5 && this.mockData.averagRating < 4.5) {
      this.mockData.averageRatingClass = 'rating-four';
    }
    else if (this.mockData.averagRating >= 4.5) {
      this.mockData.averageRatingClass = 'rating-five';
    }
  }
  /**
  * Calculates old price, Savings
  */
  calculatePriceParameters(): void {
    if (this.mockData.showInformationalPrice && !this.mockData.isEndOfLife) {
      this.greaterPrice = 1;
      if (this.mockData.listPrice.value) {
        if (this.mockData.listPrice.value > this.mockData.salePrice.value) {
          this.finalPrice = 0;
          this.greaterPrice = 0;
        } else if (!(this.mockData.salePrice.value > this.mockData.listPrice.value)) {
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

    //To calculate savings
    /*if( this.mockData.showPriceSavings && this.mockData.listPrice.value && (this.mockData.salePrice < this.mockData.listPrice )){
         let actualPriceTypeSavings =  this.mockData.listPrice.value - this.mockData.salePrice;
         if(!this.mockData.savings){
              this.shownSavings =  actualPriceTypeSavings;                                                                                                             
         } else {
              if(this.mockData?.savings < actualPriceTypeSavings){
                this.shownSavings = actualPriceTypeSavings;
              }   
         } 
    }  */
  }

  goToNextPage(thumb) {
    this.route.navigate(['/product/details', thumb.id, thumb.range]);
  }

  addToCart(itemToAdd) {
    this._dataEmitterService.addToCart(itemToAdd);
  }

  addToWishList(itemToAdd) {
    this._dataEmitterService.addToWishList(itemToAdd);
  }

  addToCompare(itemToAdd) {
    this._dataEmitterService.addToCompare(itemToAdd);
  }
}
