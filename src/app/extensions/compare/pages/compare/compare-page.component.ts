import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CompareFacade } from '../../facades/compare.facade';

import { ProductCompareListComponent } from './product-compare-list/product-compare-list.component';

@Component({
  selector: 'ish-compare-page',
  templateUrl: './compare-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, ProductCompareListComponent, TranslatePipe],
})
export class ComparePageComponent implements OnInit {
  compareProducts$: Observable<string[]>;
  compareProductsCount$: Observable<number>;

  constructor(private compareFacade: CompareFacade) {}

  ngOnInit() {
    this.compareProducts$ = this.compareFacade.compareProducts$;
    this.compareProductsCount$ = this.compareFacade.compareProductsCount$;
  }
}
