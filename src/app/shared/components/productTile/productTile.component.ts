import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {DataEmitterService} from '../../services/dataEmitter.service';

@Component({
  selector: 'is-producttile',
  templateUrl: './productTile.component.html',
  styleUrls: ['./productTile.component.css']
})
export class ProductTileComponent {
  @Input() _data: any;

  constructor(private route: Router, private _dataEmitterService: DataEmitterService) {
  };

  goToNextPage(thumb) {
    this.route.navigate(['/product/details', thumb.id, thumb.range]);
  };

  addToCart(itemToAdd) {
    this._dataEmitterService.addToCart(itemToAdd);
  };

  addToWishList(itemToAdd) {
    this._dataEmitterService.addToWishList(itemToAdd);
  };

  addToCompare(itemToAdd) {
    this._dataEmitterService.addToCompare(itemToAdd);
  };
}
