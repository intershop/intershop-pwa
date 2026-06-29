import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductContextAccessDirective } from 'ish-core/directives/product-context-access.directive';

@Component({
  selector: 'ish-product-brand',
  imports: [ProductContextAccessDirective, RouterLink, TranslatePipe],
  standalone: true,
  templateUrl: './product-brand.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBrandComponent {}
