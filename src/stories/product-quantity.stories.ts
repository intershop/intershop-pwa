import { FormControl, FormGroup } from '@angular/forms';
import { boolean, radios, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata, storiesOf } from '@storybook/angular';

import { Product } from 'ish-core/models/product/product.model';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';

import { defaultModuleMetadata } from './storybook-helper';

const product = {
  inStock: true,
  availability: true,
  minOrderQuantity: 1,
  maxOrderQuantity: 10,
} as Product;

const controlName = 'quantity';

const parentForm = new FormGroup({ quantity: new FormControl(1) });

storiesOf('ish-product-quantity', module)
  .addParameters({
    // parameters: {
    notes: 'My extra special notes just for you',
    // },
  })
  .addDecorator(moduleMetadata(defaultModuleMetadata))
  .add('type: input', () => ({
    component: ProductQuantityComponent,
    props: {
      product,
      controlName,
      parentForm,
      type: 'input',
    } as ProductQuantityComponent,
  }))
  .add('type: select', () => ({
    component: ProductQuantityComponent,
    props: {
      product,
      controlName,
      parentForm,
      type: 'select',
    } as ProductQuantityComponent,
  }))
  .add('type: counter', () => ({
    component: ProductQuantityComponent,
    props: {
      product,
      controlName,
      parentForm,
      type: 'counter',
    } as ProductQuantityComponent,
  }));

storiesOf('ish-product-quantity/withKnobs', module)
  .addDecorator(moduleMetadata(defaultModuleMetadata))
  .addDecorator(withKnobs)
  .add('flexible', () => ({
    component: ProductQuantityComponent,
    props: {
      product,
      controlName,
      parentForm,
      type: radios('type', { input: 'input', select: 'select', counter: 'counter' }, 'input'),
      readOnly: boolean('readOnly', false),
    } as ProductQuantityComponent,
  }));
