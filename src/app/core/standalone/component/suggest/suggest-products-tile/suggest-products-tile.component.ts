import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Product } from 'ish-core/models/product/product.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { PipesModule } from 'ish-core/pipes.module';

@Component({
  selector: 'ish-suggest-products-tile',
  templateUrl: './suggest-products-tile.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, TranslateModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestProductsTileComponent {
  @Input() products: Product[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Input() deviceType: DeviceType;
  @Output() routeChange = new EventEmitter<void>();

  private destroyRef = inject(DestroyRef);
  private currencySymbol: string;
  private noImageImageUrl = '/assets/img/not-available.svg';

  constructor(private appFacade: AppFacade) {
    this.appFacade.currentCurrency$
      .pipe(
        switchMap(currency => this.appFacade.currencySymbol$(currency)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(currencySymbol => (this.currencySymbol = currencySymbol));
  }

  handleInputFocus(): void {
    this.routeChange.emit();
  }

  getImageEffectiveUrl(product: Product): string {
    const image = product.images?.find(img => img.typeID === 'S');
    return image ? image.effectiveUrl : this.noImageImageUrl;
  }

  truncate(text: string, limit: number): string {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  }
}
