import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, ReplaySubject } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { PipesModule } from 'ish-core/pipes.module';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';

@Component({
  selector: 'ish-suggest-products-tile',
  templateUrl: './suggest-products-tile.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, TranslateModule, RouterModule, ProductImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestProductsTileComponent implements OnInit {
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Input() deviceType: DeviceType;
  @Output() routeChange = new EventEmitter<void>();

  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  handleInputFocus(): void {
    this.routeChange.emit();
  }

  truncate(text: string, limit: number): string {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  }
}
