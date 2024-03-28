import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'ng-template[swiperSlide]',
})
// eslint-disable-next-line ish-custom-rules/project-structure
export class SwiperSlideDirective {
  @Input() slideID: string | number;
  constructor(public template: TemplateRef<unknown>) {}
}
