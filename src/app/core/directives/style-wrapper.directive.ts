import { Directive, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

/**
 * The <isStyleWrapper> directive dynamicaly adds a context specific CSS class based on a setting in the route handling, e.g. 'homepage' or 'errorpage'
 */
@Directive({
  selector: '[isStyleWrapper]'
})
export class StyleWrapperDirective implements OnInit {

  @HostBinding('class') classesString = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.route)
      .map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        this.addClass(event['className'] || '');
      });
  }

  private addClass(className: string) {
    this.classesString = className;
  }
}
