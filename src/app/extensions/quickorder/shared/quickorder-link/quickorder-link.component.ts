import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ish-quickorder-link',
  imports: [RouterLink, TranslatePipe],
  standalone: true,
  templateUrl: './quickorder-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickorderLinkComponent {}
