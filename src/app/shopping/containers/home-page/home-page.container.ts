// NEEDS_WORK: DUMMY COMPONENT - container tslint rule disabled as long as it needs work
// tslint:disable ccp-no-markup-in-containers
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-home-page-container',
  templateUrl: './home-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HomePageContainerComponent {

}
