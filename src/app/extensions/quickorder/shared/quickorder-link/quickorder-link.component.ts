import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-quickorder-link',
  templateUrl: './quickorder-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, TranslatePipe],
})
@GenerateLazyComponent()
export class QuickorderLinkComponent {}
