import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreState } from '../../../core/store/core.state';
import { Product } from '../../../models/product/product.model';
import { getCompareProducts } from '../../store/compare';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageContainerComponent implements OnInit {

  compareProducts$: Observable<Product[]>;

  constructor(
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.compareProducts$ = this.store.pipe(select(getCompareProducts));
  }
}
