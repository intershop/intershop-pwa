import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TransferState } from '@angular/platform-browser';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * Footer Component
 */
@Component({
  selector: 'ish-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  @Input() deviceType: DeviceType;

  appVersion: string;

  constructor(private transferState: TransferState) {}

  ngOnInit() {
    if (!SSR) {
      this.appVersion = this.transferState.get(DISPLAY_VERSION, '');
    }
  }
}
