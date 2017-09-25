import { environment } from '../../../environments/environment';
import { CategoryFamilyHostComponent } from '../../components/category-family-host/category-family-host.component';
import { CategoryPageComponent } from './category-page.component';

const categoryPageRoute = [];

class CategoryRoutes {
  static createRoute() {
    let path = ':category-name';
    categoryPageRoute.push(
      { path: path, component: CategoryPageComponent }
    );
    for (let depthIndex = 0; depthIndex < environment.routingDepth; depthIndex++) {
      path += '/:subcategory';
      categoryPageRoute.push({ path: path, component: CategoryFamilyHostComponent });
    }
  }
}

CategoryRoutes.createRoute();

export let CategoryPageRoute = categoryPageRoute;
