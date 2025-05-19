import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { DirectivesModule } from 'ish-core/directives.module';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { PipesModule } from 'ish-core/pipes.module';
import { SuggestProductsTileComponent } from 'ish-shared/components/search/suggest-products-tile/suggest-products-tile.component';

@Component({
  selector: 'ish-suggest-products',
  templateUrl: './suggest-products.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, DirectivesModule, TranslateModule, RouterModule, SuggestProductsTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestProductsComponent {
  @Input({ required: true }) products: string[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Input() deviceType: DeviceType;
  @Output() routeChange = new EventEmitter<void>();

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
