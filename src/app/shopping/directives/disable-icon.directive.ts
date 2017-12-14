// NEEDS_WORK: directive not supposed to call the service, the basic functionality should probably be less compare specific, other wise adapt the name
import { Directive, ElementRef, Injector, Input, Renderer2 } from '@angular/core';
import { GlobalStateAwareService } from '../../core/services/base-services/global-state-aware.service';
import { ProductCompareService } from '../../core/services/product-compare/product-compare.service';

@Directive({
  selector: '[ishDisableIcon]'
})
export class DisableIconDirective {

  @Input() property: string;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private injector: Injector
  ) { }

  private update = compareListItems => {
    if (compareListItems) {
      if (compareListItems.find(compareProduct => compareProduct === this.property)) {
        this.renderer.addClass(this.el.nativeElement, 'is-selected');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'is-selected');
      }
    }
  }

  @Input()
  set globalStateKey(globalStateKey: string) {
    let service: GlobalStateAwareService<string[]>;
    if (globalStateKey === 'productCompareData') {
      service = this.injector.get(ProductCompareService);
    } else {
      throw new Error('cannot resolve service for "' + globalStateKey + '"');
    }

    service.subscribe(this.update);
    this.update(service.getValue());
  }
}

