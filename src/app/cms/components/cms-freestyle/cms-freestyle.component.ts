import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CMSComponentBase } from '../cms-component-base/cms-component-base';

@Component({
  selector: 'ish-cms-freestyle',
  templateUrl: './cms-freestyle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSFreestyleComponent extends CMSComponentBase {}
