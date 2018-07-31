import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-info-box',
  templateUrl: './info-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoBoxComponent {
  @Input()
  heading = '';
  @Input()
  editRouterLink: string;
}
