import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, ReplaySubject, map } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
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

  productURL$: Observable<string>;
  productName$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.productURL$ = this.context.select('productURL');
    this.productName$ = this.context
      .select('product', 'name')
      // truncate product name on desktop only
      .pipe(map(name => (this.deviceType === 'desktop' ? this.truncate(name, 38) : name)));
  }

  private truncate(text: string, limit: number): string {
    return text.length > limit + 3 ? `${text.substring(0, limit)}...` : text;
  }

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
