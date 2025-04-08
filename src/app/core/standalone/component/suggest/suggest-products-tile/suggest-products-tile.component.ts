import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

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
export class SuggestProductsTileComponent implements OnInit {
  @Input() products: Partial<Product>[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Input() deviceType: DeviceType;
  @Output() routeChange = new EventEmitter<void>();

  private staticURL: string;
  private noImageImageUrl = '/assets/img/not-available.svg';
  private destroyRef = inject(DestroyRef);

  constructor(private appFacade: AppFacade) {}

  ngOnInit(): void {
    this.appFacade.getStaticEndpoint$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(staticURL => {
      this.staticURL = staticURL;
      this.noImageImageUrl = `${this.staticURL}${this.noImageImageUrl}`;
    });
  }

  handleInputFocus(): void {
    this.routeChange.emit();
  }

  getImageEffectiveUrl(product: Partial<Product>): string {
    let imageUrl = product.images?.find(img => img.typeID === 'S')?.effectiveUrl;
    if (imageUrl && !imageUrl.match('^(https?|file):')) {
      imageUrl = `${this.staticURL}/${imageUrl}`;
    }
    return imageUrl ? imageUrl : this.noImageImageUrl;
  }

  truncate(text: string, limit: number): string {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  }
}
