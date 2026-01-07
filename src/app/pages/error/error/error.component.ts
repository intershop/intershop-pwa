import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { SearchBoxComponent } from 'ish-shared/components/search/search-box/search-box.component';

/**
 * The Error Page Component informs the user that the server returned an error.
 * It uses the {@link SearchBoxComponent}.
 *
 * @example
 * <ish-error-page />
 */
@Component({
  selector: 'ish-error',
  templateUrl: './error.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslateModule, ServerHtmlDirective, SearchBoxComponent, TranslateModule],
})
export class ErrorComponent {}
