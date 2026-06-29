import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { SuggestProductsTileComponent } from 'ish-shared/components/search/suggest-products-tile/suggest-products-tile.component';

@Component({
  selector: 'ish-suggest-products',
  imports: [ProductContextDirective, SlicePipe, SuggestProductsTileComponent, TranslatePipe],
  standalone: true,
  templateUrl: './suggest-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestProductsComponent {
  @Input({ required: true }) products: string[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Input() deviceType: DeviceType;
  @Output() readonly routeChange = new EventEmitter<void>();

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
