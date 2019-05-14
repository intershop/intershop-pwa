import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-recently-viewed',
  templateUrl: './recently-viewed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyViewedComponent {
  @Input() products: string[];
}
