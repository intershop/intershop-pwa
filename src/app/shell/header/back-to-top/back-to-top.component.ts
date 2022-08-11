import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';

@Component({
  selector: 'ish-back-to-top',
  templateUrl: './back-to-top.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopComponent {
  /**
   * @description
   * Button will not show if window.scrollY is less than MARGIN_TOP.
   * Should be any desired value > 0
   */
  private readonly MARGIN_TOP = 50;

  /**
   * @description
   * Button will show if user has scrolled at least SCROLL_MIN upwards.
   * If set to 0 the button will show as soon as user scrolls upwards
   */
  private readonly SCROLL_MIN = 50;

  isVisible = false;
  private previousOffset = 0;

  jump() {
    window.scrollTo(0, 0);
  }

  private hide() {
    this.isVisible = false;
  }

  private show() {
    this.isVisible = true;
  }

  private updateOffset() {
    this.previousOffset = window.scrollY;
  }

  @HostListener('window:scroll') onWindowScroll() {
    const diff = this.previousOffset - window.scrollY;

    const scrollsDown = diff < 0;
    const isAtTop = window.scrollY < this.MARGIN_TOP;
    const hasEnoughIntention = diff > this.SCROLL_MIN;

    if (scrollsDown || isAtTop) {
      this.updateOffset();
      this.hide();
    } else if (!this.isVisible && !hasEnoughIntention) {
      this.hide();
    } else {
      this.updateOffset();
      this.show();
    }
  }
}
