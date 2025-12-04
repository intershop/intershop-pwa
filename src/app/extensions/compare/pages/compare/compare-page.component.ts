import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CompareFacade } from '../../facades/compare.facade';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCompareListComponent } from './product-compare-list/product-compare-list.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'ish-compare-page',
  templateUrl: './compare-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, ProductCompareListComponent, AsyncPipe, TranslateModule],
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
