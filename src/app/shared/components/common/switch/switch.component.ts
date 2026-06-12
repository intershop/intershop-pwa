import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'ish-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Switch Component is a reusable component that allows toggling between two states for a given object.
 * The bootstrap switch component is used to render the switch.
 *
 * @example
 * <ish-switch
 *   ariaLabel="{{'account.recurring_orders.table.switch.aria_label' | translate : { '0': recurringOrder.documentNo } }}"
 *   [active]="recurringOrder.active"
 *   [id]="recurringOrder.id"
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
  // ariaLabel can be used to provide a label for screen readers (translated text is accepted)
  @Input() ariaLabel = '';

  @Output() readonly toggleSwitch = new EventEmitter<{ active: boolean; id: string }>();

  activeState: boolean;

  ngOnChanges() {
    this.activeState = this.active;
  }

  toggleState() {
    this.activeState = !this.activeState;
    this.toggleSwitch.emit({ active: this.activeState, id: this.id });
  }
}
