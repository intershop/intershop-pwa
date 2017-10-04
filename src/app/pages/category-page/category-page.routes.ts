// Dynamic routes not supported wuth Server Side rendering
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


// Works with Server side Rendering

// import { CategoryFamilyHostComponent } from '../../components/category-family-host/category-family-host.component';
// import { CategoryPageComponent } from './category-page.component';

// export const CategoryPageRoute = [
//   { path: ':categoryId', component: CategoryPageComponent },
//   { path: ':categoryId/:subcategory', component: CategoryFamilyHostComponent },
//   { path: ':categoryId/:subcategory/:subcategory', component: CategoryFamilyHostComponent },
//   { path: ':categoryId/:subcategory/:subcategory/:subcategory', component: CategoryFamilyHostComponent }
// ];
