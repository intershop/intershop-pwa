import { environment } from '../../../environments/environment';
import { CategoryPageComponent } from './category-page.component';
import { DeciderComponent } from './decider.component';

const categoryPageRoute = [];

class CategoryRoutes {
  static createRoute() {
    categoryPageRoute.push(
      { path: ':category-name', component: CategoryPageComponent }
    );
    let path = ':category-name';
    for (let i = 0; i < environment.routingDepth; i++) {
      path += '/:subcategory';
      categoryPageRoute.push({ path: path, component: DeciderComponent });
    }
  }
}

CategoryRoutes.createRoute();

export let CategoryPageRoute = categoryPageRoute;
