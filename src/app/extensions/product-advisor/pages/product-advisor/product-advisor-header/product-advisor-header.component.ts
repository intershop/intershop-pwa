import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-product-advisor-header',
  standalone: false,
  templateUrl: './product-advisor-header.component.html',
  styleUrls: ['./product-advisor-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorHeaderComponent {}
