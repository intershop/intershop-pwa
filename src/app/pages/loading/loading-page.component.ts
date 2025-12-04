import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

@Component({
  selector: 'ish-loading-page',
  imports: [LoadingComponent],
  standalone: true,
  templateUrl: './loading-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingPageComponent {}
