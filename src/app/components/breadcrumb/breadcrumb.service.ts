import { Injectable } from '@angular/core';

@Injectable()
export class BreadcrumbService {
    public routesWithCallbackRegex: Map<string, (string: string) => string> = new Map<string, (string: string) => string>();
    public hideRoutesRegex: any = new Array<string>();

    /**
     * Specify a callback for the corresponding route matching a regular expression.
     * When a mathing url is navigated to, the callback function is invoked to get the name to be displayed in the breadcrumb.
     */
    addCallbackForRouteRegex(routeRegex: string, callback: (id: string) => string): void {
        this.routesWithCallbackRegex.set(routeRegex, callback);
    }

    /**
     * Show the friendly name for a given route (url). If no match is found the url (without the leading '/') is shown.
     *
     * @param route
     * @returns {*}
     */
    getFriendlyNameForRoute(route: string): string {
        let name: string;
        const routeEnd = route.substr(route.lastIndexOf('/') + 1, route.length);

        this.routesWithCallbackRegex.forEach((value, key, map) => {
            if (new RegExp(key).exec(route)) {
                name = value(routeEnd);
            }
        });

        return name ? name : routeEnd;
    }

    /**
     * Specify a route (url) regular expression that should not be shown in the breadcrumb.
     */
    hideRouteRegex(routeRegex: string): void {
        if (this.hideRoutesRegex.indexOf(routeRegex) === -1) {
            this.hideRoutesRegex.push(routeRegex);
        }
    }

    /**
     * Returns true if a route should be hidden.
     */
    isRouteHidden(route: string): boolean {
        let hide = false;
        this.hideRoutesRegex.forEach((value: any) => {
            if (new RegExp(value).exec(route)) {
                hide = true;
            }
        });
        return hide;
    }
}
