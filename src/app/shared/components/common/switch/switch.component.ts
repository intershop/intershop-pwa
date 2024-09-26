import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'ish-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
/**
 * The Switch Component is a reusable component that allows toggling between two states for a given object.
 * The bootstrap switch component is used to render the switch.
 *
 * @example
 * <ish-switch
 *   [id]="recurringOrder.id"
 *   [active]="recurringOrder.active"
 *   (toggleSwitch)="switchActiveStatus($event)"
 * />
 */
export class SwitchComponent implements OnChanges {
  // id is not required but can be used to identify the switch context
  @Input() id: string = uuid();
  @Input() active = false;
  @Input() labelActive = '';
  @Input() labelInactive = '';
  @Input() disabled = false;

  @Output() toggleSwitch = new EventEmitter<{ active: boolean; id: string }>();

  activeState: boolean;

  ngOnChanges() {
    this.activeState = this.active;
  }

  toggleState() {
    this.activeState = !this.activeState;
    this.toggleSwitch.emit({ active: this.activeState, id: this.id });
  }
}
