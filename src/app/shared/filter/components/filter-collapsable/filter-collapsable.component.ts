import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-filter-collapsable',
  templateUrl: './filter-collapsable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterCollapsableComponent {
  @Input() title: string;

  isCollapsed = false;
}
