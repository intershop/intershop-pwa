import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ProductContextAccessDirective } from 'ish-core/directives/product-context-access.directive';

@Component({
  selector: 'ish-product-brand',
  templateUrl: './product-brand.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ProductContextAccessDirective, NgIf, RouterLink, TranslateModule],
})
export class ProductBrandComponent {}
