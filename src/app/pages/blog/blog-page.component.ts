import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-blog-page',
  templateUrl: './blog-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPageComponent {}
