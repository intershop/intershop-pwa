import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-product-variation-select-enhanced',
  templateUrl: './product-variation-select-enhanced.component.html',
  styleUrls: ['./product-variation-select-enhanced.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationSelectEnhancedComponent implements OnInit {
  @Input() group: VariationOptionGroup;
  @Input() uuid: string;
  @Input() multipleOptions: boolean;

  @Output() changeOption = new EventEmitter<{ group: string; value: string }>();

  deviceType$: Observable<DeviceType>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
  }

  optionChange(group: string, value: string) {
    this.changeOption.emit({ group, value });
  }
}
