import { Component, OnInit } from '@angular/core';
import { DataEmitterService } from 'app/services/data-emitter.service';

@Component({
  selector: 'is-product-compare-status',
  templateUrl: './product-compare.component.html'
})

export class ProductCompareComponent implements OnInit {
  compareListItems = [];
  itemCount = 0;
  constructor(private _dataEmitterService: DataEmitterService) { }

  ngOnInit() {
    this._dataEmitterService.comparerListEmitter.subscribe(data => {
      this.itemCount = 0;
      this.compareListItems.push(data);
      this.compareListItems.forEach(item => {
        this.itemCount = this.itemCount + 1;
      });
    });
  }
};
