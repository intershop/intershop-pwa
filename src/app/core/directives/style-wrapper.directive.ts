import { Directive, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

/**
 * The <ishStyleWrapper> directive dynamicaly adds a context specific CSS class based on a setting in the route handling, e.g. 'homepage' or 'errorpage'
 */
// TODO: Is there a better/simpler way to set context CSS classes based on used page component (not using the routing)
@Directive({
  selector: '[ishStyleWrapper]',
})
export class StyleWrapperDirective implements OnInit {
  @HostBinding('class') classesString = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(event => {
        this.addClass(event['className'] || '');
      });
  }

  private addClass(className: string) {
    this.classesString = className;
  }
}
