import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Loading Component
 *
 * Displayes a loading animation overlay by default, but is useable as standalone loading animation too.
 *
 * @example
 * <ish-loading></ish-loading>
 */
@Component({
  selector: 'ish-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  /**
   * If standalone is set to true the loading animation will not be displayed as overlay.
   */
  @Input() standalone = false;
}
