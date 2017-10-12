import { BreadcrumbService } from './breadcrumb.service';

describe('Breadcrumb Service', () => {
  let breadcrumbService: BreadcrumbService;
  beforeEach(() => {
    breadcrumbService = new BreadcrumbService();
  });

  it('should return true if regular expression matches a url', () => {
    const toBeHidden = breadcrumbService.isRouteHidden('/category');

    expect(toBeHidden).toBe(true);
  });

  it('should return false if regular expression does not matche a url', () => {
    const toBeHidden = breadcrumbService.isRouteHidden('/family');

    expect(toBeHidden).toBe(false);
  });

});
