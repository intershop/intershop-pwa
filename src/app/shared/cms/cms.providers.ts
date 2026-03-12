import { EnvironmentProviders, Provider, Type, makeEnvironmentProviders } from '@angular/core';

import { CMS_COMPONENT } from './configurations/injection-keys';
import { CMSComponent } from './models/cms-component/cms-component.model';

const provideLazyCMSComponent = (
  definitionQualifiedName: string,
  loadComponent: () => Promise<Type<CMSComponent>>
): Provider => ({
  provide: CMS_COMPONENT,
  useValue: {
    definitionQualifiedName,
    loadComponent,
  },
  multi: true,
});

const CMS_COMPONENT_PROVIDERS: Provider[] = [
  provideLazyCMSComponent('app_sf_base_cm:component.common.text.pagelet2-Component', () =>
    import('./components/cms-text/cms-text.component').then(m => m.CMSTextComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.freeStyle.pagelet2-Component', () =>
    import('./components/cms-freestyle/cms-freestyle.component').then(m => m.CMSFreestyleComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.container.pagelet2-Component', () =>
    import('./components/cms-container/cms-container.component').then(m => m.CMSContainerComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.image.pagelet2-Component', () =>
    import('./components/cms-image/cms-image.component').then(m => m.CMSImageComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.imageEnhanced.pagelet2-Component', () =>
    import('./components/cms-image-enhanced/cms-image-enhanced.component').then(m => m.CMSImageEnhancedComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.carousel.pagelet2-Component', () =>
    import('./components/cms-carousel/cms-carousel.component').then(m => m.CMSCarouselComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.productListManual.pagelet2-Component', () =>
    import('./components/cms-product-list-manual/cms-product-list-manual.component').then(m => m.CMSProductListManualComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.productListFilter.pagelet2-Component', () =>
    import('./components/cms-product-list-filter/cms-product-list-filter.component').then(m => m.CMSProductListFilterComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.productListCategory.pagelet2-Component', () =>
    import('./components/cms-product-list-category/cms-product-list-category.component').then(
      m => m.CMSProductListCategoryComponent
    )
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.productListRest.pagelet2-Component', () =>
    import('./components/cms-product-list-rest/cms-product-list-rest.component').then(m => m.CMSProductListRestComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.productListRecommendations.pagelet2-Component', () =>
    import('./components/cms-product-list-recommendations/cms-product-list-recommendations.component').then(
      m => m.CMSProductListRecommendationsComponent
    )
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.video.pagelet2-Component', () =>
    import('./components/cms-video/cms-video.component').then(m => m.CMSVideoComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.shopping.staticPage.pagelet2-Component', () =>
    import('./components/cms-static-page/cms-static-page.component').then(m => m.CMSStaticPageComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:pagevariant.standard.pagelet2-Pagevariant', () =>
    import('./components/cms-standard-page/cms-standard-page.component').then(m => m.CMSStandardPageComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.common.dialog.pagelet2-Component', () =>
    import('./components/cms-dialog/cms-dialog.component').then(m => m.CMSDialogComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.navigation.link.pagelet2-Component', () =>
    import('./components/cms-navigation-link/cms-navigation-link.component').then(m => m.CMSNavigationLinkComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.navigation.page.pagelet2-Component', () =>
    import('./components/cms-navigation-page/cms-navigation-page.component').then(m => m.CMSNavigationPageComponent)
  ),
  provideLazyCMSComponent('app_sf_base_cm:component.navigation.category.pagelet2-Component', () =>
    import('./components/cms-navigation-category/cms-navigation-category.component').then(
      m => m.CMSNavigationCategoryComponent
    )
  ),
];

export function provideCMS(): EnvironmentProviders {
  return makeEnvironmentProviders([...CMS_COMPONENT_PROVIDERS]);
}
