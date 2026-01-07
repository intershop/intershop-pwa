import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

@Component({
  selector: 'ish-loading-page',
  templateUrl: './loading-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LoadingComponent],
})
export class LoadingPageComponent {}
