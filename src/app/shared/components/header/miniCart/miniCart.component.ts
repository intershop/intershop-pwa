import { Component, OnInit } from '@angular/core';
import { DataEmitterService } from '../../../services/dataEmitter.service';

@Component({
  selector: 'is-minicart',
  templateUrl: './miniCart.component.html',
})

export class MiniCartComponent implements OnInit {

  public isCollapsed: boolean = true;

  cartItems = [];
  cartPrice = 0;
  cartLength = 0;

  constructor(private _dataEmitterService: DataEmitterService) {
  }


  ngOnInit() {
    this._dataEmitterService.miniCartEmitter.subscribe(data => {
      this.cartPrice = 0;
      this.cartItems.push(data);
      this.cartItems.forEach(item => {
        this.cartPrice = this.cartPrice + item.Price;
      });
      this.cartLength = this.cartItems.length;
    });
  }
}
