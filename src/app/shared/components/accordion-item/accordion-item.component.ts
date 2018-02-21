import { Component, Input } from '@angular/core';

@Component({
  selector: 'ish-accordion-item',
  templateUrl: './accordion-item.component.html',
})
export class AccordionItemComponent {

  @Input() heading: string;
  @Input() dataTestingId: string;

  isOpen = false;

  /**
   * toggle accordion item
   * @returns void
   */
  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }
}
