import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ish-product-tile-actions',
  templateUrl: './product-tile-actions.component.html'
})
export class ProductTileActionsComponent implements OnInit {

  @Input() isInCompareList: boolean;
  @Output() compareToggle = new EventEmitter<any>();

  ngOnInit() {
  }

  toggleCompare() {
    this.compareToggle.emit();
  }

}
