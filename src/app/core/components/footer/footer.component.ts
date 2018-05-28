// NEEDS_WORK: DUMMY COMPONENT
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  // TODO: the content of the footer needs to come from the Intershop CMS
  // TODO: the Bootstrap collapsibles in the footer currently miss the behavior of being collapsed on XS screen size but not on larger screens
}
