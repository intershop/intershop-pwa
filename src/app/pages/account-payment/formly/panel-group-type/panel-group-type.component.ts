import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

/**
 * Group type that renders children wrapped in a panel with a group heading.
 */
@Component({
  selector: 'ish-panel-group-type',
  templateUrl: './panel-group-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelGroupTypeComponent extends FieldType {}
