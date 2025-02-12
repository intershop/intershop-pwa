import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { Brand } from 'ish-core/models/suggestion/suggestion.model';
import { PipesModule } from 'ish-core/pipes.module';

@Component({
  selector: 'ish-suggest-brands-tile',
  templateUrl: './suggest-brands-tile.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, TranslateModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestBrandsTileComponent {
  @Input() brands: Brand[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() routeChange = new EventEmitter<void>();

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
