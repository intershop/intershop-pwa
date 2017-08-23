import { Component, OnInit } from '@angular/core';
import { DataEmitterService } from '../../../services/data-emitter.service';
import { CacheCustomService } from '../../../services/cache/cache-custom.service';

@Component({
  selector: 'is-product-compare-status',
  templateUrl: './product-compare-status.component.html'
})

export class ProductCompareStatusComponent implements OnInit {
  compareListItems = [];
  cacheStoreKey: string = 'productCompareKey';

  /**
   * Constructor
   * @param  {DataEmitterService} private_dataEmitterService
   * @param  {CacheCustomService} privatecacheCustomService
   */
  constructor(private _dataEmitterService: DataEmitterService,
    private cacheCustomService: CacheCustomService) { }

  ngOnInit() {
    if (this.cacheCustomService.cacheKeyExists(this.cacheStoreKey)) {
      const cachedComparedItems = this.cacheCustomService.getCachedData(this.cacheStoreKey);
      this.compareListItems = cachedComparedItems ? cachedComparedItems : [];
    }
    this._dataEmitterService.comparerListEmitter.subscribe(data => {
      const index = this.compareListItems.indexOf(data);
      if (index > -1) {
        this.compareListItems.splice(index, 1);
      } else {
        this.compareListItems.push(data);
      }
      this.cacheCustomService.storeDataToCache(this.compareListItems, this.cacheStoreKey);
    });
  }
};