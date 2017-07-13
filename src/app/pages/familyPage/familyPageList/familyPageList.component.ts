import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataEmitterService} from '../../../shared/services/dataEmitter.service';
import {ProductListService} from './productListService/ProductList.service';
import {CacheCustomService} from '../../../shared/services/cache/cacheCustom.service';

@Component({
  selector: 'is-familypagelist',
  templateUrl: './familyPageList.component.html',
  styleUrls: ['./familyPageList.component.css']

})


export class FamilyPageListComponent implements OnInit {

  thumbnailKey: 'thumbnailKey';
  AllCategories: 'AllCategories';
  allData: any;
  thumbnails = [];
  filteredData;

  constructor(private route: Router,
              private _dataEmitterService: DataEmitterService,
              private productListService: ProductListService,
              private customService: CacheCustomService) {
  }

  ngOnInit() {
    if (this.customService.CacheKeyExists(this.thumbnailKey)) {
      this.allData = this.customService.GetCachedData(this.thumbnailKey);
    } else {
      this.productListService.getProductList().subscribe(data => {
        this.allData = data;
        this.customService.StoreDataToCache(this.allData, this.thumbnailKey, true);
      });
    }
    this.thumbnails = this.allData[0]['Cameras'];

    this._dataEmitterService.emitter.subscribe(data => {
      let itemExists = [];
      let isFiltered = false;
      const _that = this;
      this.filteredData = this.allData[0]['Cameras']
      if (Object.keys(data.category).length !== 0) {
        this.thumbnails = this.allData[0][data.category.name]
        isFiltered = true;
      } else {
        this.thumbnails = this.allData[0]['Cameras'];
      }

      if (data.brand && data.brand.length > 0) {
        itemExists = [];
        if (isFiltered) {
          _that.filteredData = this.thumbnails;
        }
        data.brand.forEach(function (item) {
          _that.filteredData.forEach(function (product) {
            if (item.name === product.Brand) {
              itemExists.push(product);
            }
          })
        })
        isFiltered = true;
        this.thumbnails = itemExists;
      }
      if (Object.keys(data.price).length !== 0) {
        itemExists = [];
        if (isFiltered) {
          this.filteredData = this.thumbnails;
        }
        // this.thumbnails.filter(item => console.log(item));
        this.filteredData.forEach(function (item) {
          if ((item.Price > data.price.min) && (item.Price < data.price.max)) {
            itemExists.push(item);
          }
        })
        this.thumbnails = itemExists;
        isFiltered = true;

      }
      if (Object.keys(data.color).length !== 0) {
        itemExists = [];
        if (isFiltered) {
          this.filteredData = this.thumbnails;
        }
        // this.thumbnails.filter(item => console.log(item));
        this.filteredData.forEach(function (item) {
          if (item.color === data.color.name) {
            itemExists.push(item);
          }
        })
        this.thumbnails = itemExists;
        isFiltered = true;

      }

    })
  }

  goToNextPage(thumb) {
    this.route.navigate(['/product/details', thumb.id, thumb.range]);
  };

  addToCart(itemToAdd) {
    this._dataEmitterService.addToCart(itemToAdd);
  }

}

