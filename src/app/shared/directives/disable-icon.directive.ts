import { Directive, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { GlobalState } from '../../shared/services';
import * as _ from 'lodash';

@Directive({
    selector: '[is-disable-icon]'
})
export class DisableIconDirective implements OnInit {
    @Input() property: string;
    @Input() globalStateKey: string;

    constructor(private globalState: GlobalState,
        private renderer: Renderer2,
        private el: ElementRef) {
    }

    ngOnInit() {
        this.toggleClass();
    }

    toggleClass() {
        this.globalState.subscribeCachedData(this.globalStateKey, compareListItems => {
            if (_.find(compareListItems, compareProduct => compareProduct === this.property)) {
                this.renderer.addClass(this.el.nativeElement, 'is-selected')
            } else {
                this.renderer.removeClass(this.el.nativeElement, 'is-selected')
            }
        });
    };
}

