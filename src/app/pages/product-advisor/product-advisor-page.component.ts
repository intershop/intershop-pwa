import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-product-advisor-page',
  standalone: false,
  templateUrl: './product-advisor-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorPageComponent {}
