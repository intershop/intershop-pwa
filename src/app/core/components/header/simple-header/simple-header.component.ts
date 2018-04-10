import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-simple-header',
  templateUrl: './simple-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleHeaderComponent { }
