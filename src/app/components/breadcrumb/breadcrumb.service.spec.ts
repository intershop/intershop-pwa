import { BreadcrumbService } from './breadcrumb.service';

describe('Breadcrumb Service', () => {
    let breadcrumbService: BreadcrumbService;
    beforeEach(() => {
        breadcrumbService = new BreadcrumbService();
    });
    // tslint:disable-next-line:meaningful-naming-in-tests
    it('should confirm that call back for a regular expression is called and regular expression is executed for the matching route  ', () => {
        breadcrumbService.addCallbackForRouteRegex('.*%.*', (route) => {
            return route.replace(/%20/g, ' ').replace(/%26/g, '&');
        });

        const formattedRout = breadcrumbService.getFriendlyNameForRoute('Digital%20Cameras');
        expect(formattedRout).toBe('Digital Cameras');
    });

    describe(' Hide a url in breadcrumbs', () => {
      // tslint:disable-next-line:meaningful-naming-in-tests
        it('should confirm the length of hideRoutesRegex to be 1', () => {
            expect(breadcrumbService.hideRoutesRegex.length).toBe(0);

            breadcrumbService.hideRouteRegex('/category$');

            expect(breadcrumbService.hideRoutesRegex.length).toBe(1);
        });

        it('should return true if regular expression matches a url', () => {
            breadcrumbService.hideRouteRegex('/category$');

            const toBeHidden = breadcrumbService.isRouteHidden('/category');

            expect(toBeHidden).toBe(true);
        });
        // tslint:disable-next-line:meaningful-naming-in-tests
        it('should return false if regular expression does not matche a url', () => {
            breadcrumbService.hideRouteRegex('/category$');

            const toBeHidden = breadcrumbService.isRouteHidden('/family');

            expect(toBeHidden).toBe(false);
        });
    });
});
