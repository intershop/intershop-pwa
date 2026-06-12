import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CompareFacade } from '../../facades/compare.facade';

@Component({
  selector: 'ish-compare-page',
  templateUrl: './compare-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
