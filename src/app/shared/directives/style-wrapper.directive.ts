import { Directive, HostBinding, Renderer, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Directive({
    selector: '[is-style-wrapper]'
})
export class StyleWrapperDirective implements OnInit {

    @HostBinding('class') classesString: string = '';
    constructor(private router: Router,
        private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => this.route)
            .map((route) => {
                while (route.firstChild) { route = route.firstChild };
                return route;
            })
            .filter((route) => route.outlet === 'primary')
            .mergeMap((route) => route.data)
            .subscribe((event) => {
                this.addClass(event['className'] || '');
            });
    };

    private addClass(className: string) {
        this.classesString = className;
    }
}
