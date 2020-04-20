import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-lazy-header-quickorder',
  templateUrl: './lazy-header-quickorder.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})

// tslint:disable-next-line:component-creation-test
export class LazyHeaderQuickorderComponent {
  componentLocation = {
    moduleId: 'ish-extensions-quickorder',
    selector: 'ish-header-quickorder',
  };
}
