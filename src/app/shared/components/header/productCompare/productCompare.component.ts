import { Component, OnInit } from '@angular/core';
import { DataEmitterService } from '../../../services/dataEmitter.service';

@Component({
  selector: 'is-productcomparestatus',
  templateUrl: './ProductCompare.component.html'
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
}
