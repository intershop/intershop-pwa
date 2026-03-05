import { AsyncPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { Brand } from 'ish-core/models/brand/brand.model';
import { HighlightPipe } from 'ish-core/pipes/highlight.pipe';

@Component({
  selector: 'ish-suggest-brands',
  templateUrl: './suggest-brands.component.html',
  standalone: true,
  imports: [AsyncPipe, HighlightPipe, RouterLink, SlicePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestBrandsComponent {
  @Input() brands: Brand[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() routeChange = new EventEmitter<string>();

  handleInputFocus(brandName: string): void {
    this.routeChange.emit(brandName);
  }
}
