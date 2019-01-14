import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CMSComponentBase } from '../cms-component-base/cms-component-base';

@Component({
  selector: 'ish-cms-text',
  templateUrl: './cms-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSTextComponent extends CMSComponentBase {}
