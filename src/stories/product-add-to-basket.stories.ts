import { moduleMetadata, storiesOf } from '@storybook/angular';
import { of } from 'rxjs';

import { Product } from 'ish-core/models/product/product.model';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { defaultModuleMetadata } from './storybook-helper';

const product = {
  inStock: true,
  availability: true,
} as Product;

storiesOf('ish-product-add-to-basket/default', module)
  .addDecorator(moduleMetadata(defaultModuleMetadata))
  .add('displayType: icon', () => ({
    component: ProductAddToBasketComponent,
    props: {
      product,
      displayType: 'icon',
    } as ProductAddToBasketComponent,
  }))
  .add('displayType: link', () => ({
    component: ProductAddToBasketComponent,
    props: {
      product,
      displayType: 'link',
    } as ProductAddToBasketComponent,
  }));

storiesOf('ish-product-add-to-basket/loading', module)
  .addDecorator(moduleMetadata(defaultModuleMetadata))
  .add('displayType: icon', () => ({
    component: ProductAddToBasketComponent,
    props: {
      product,
      displayType: 'icon',
      displaySpinner$: of(true),
    } as ProductAddToBasketComponent,
  }))
  .add('displayType: link', () => ({
    component: ProductAddToBasketComponent,
    props: {
      product,
      displayType: 'link',
      displaySpinner$: of(true),
    } as ProductAddToBasketComponent,
  }));
