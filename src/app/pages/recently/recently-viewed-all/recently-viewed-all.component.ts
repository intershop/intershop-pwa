import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ish-recently-viewed-all',
  templateUrl: './recently-viewed-all.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyViewedAllComponent {
  @Input() products: string[];
  @Output() clearRecently = new EventEmitter<void>();

  clearAll() {
    this.clearRecently.emit();
  }
}
