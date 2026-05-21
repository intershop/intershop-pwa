import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-product-brand',
  standalone: false,
  templateUrl: './product-brand.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBrandComponent {}
