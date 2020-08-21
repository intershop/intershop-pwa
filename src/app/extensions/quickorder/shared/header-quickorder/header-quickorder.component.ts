import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-header-quickorder',
  templateUrl: './header-quickorder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class HeaderQuickorderComponent {}
