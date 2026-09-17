import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-product-advisor-results',
  standalone: false,
  templateUrl: './product-advisor-results.component.html',
  styleUrls: ['./product-advisor-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorResultsComponent {}
