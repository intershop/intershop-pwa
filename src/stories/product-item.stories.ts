import { moduleMetadata, storiesOf } from '@storybook/angular';

import { ProductItemContainerConfiguration } from 'ish-shared/components/product/product-item/product-item.component';

import { defaultModuleMetadata } from './storybook-helper';

storiesOf('ish-product-item/tile', module)
  .addDecorator(moduleMetadata(defaultModuleMetadata))
  .add('normal product', () => ({
    template: `<div class="product-list">
      <ish-product-item productSku="201807171" quantity="1"></ish-product-item>
    </div>`,
  }))
  .add('master product', () => ({
    template: `<div class="product-list">
      <ish-product-item productSku="201807231" quantity="1"></ish-product-item>
    </div>`,
  }))
  .add('variation product', () => ({
    template: `<div class="product-list">
      <ish-product-item productSku="201807231-06" quantity="1"></ish-product-item>
    </div>`,
  }))
  .add('sale product', () => ({
    template: `<div class="product-list">
      <ish-product-item productSku="1612143" quantity="1"></ish-product-item>
    </div>`,
  }))
  .add('bundle', () => ({
    template: `<div class="product-list">
      <ish-product-item productSku="201807194" quantity="1"></ish-product-item>
    </div>`,
  }))
  .add('retail set', () => ({
    template: `<div class="product-list">
      <ish-product-item productSku="M4548736000919" quantity="1"></ish-product-item>
    </div>`,
  }));

const configuration: Partial<ProductItemContainerConfiguration> = {
  displayType: 'row',
};

storiesOf('ish-product-item/row', module)
  .addDecorator(moduleMetadata(defaultModuleMetadata))
  .add('normal product', () => ({
    template: `<div class="product-list-item list-view">
      <ish-product-item productSku="201807171" quantity="1" [configuration]="configuration"></ish-product-item>
    </div>`,
    props: { configuration },
  }))
  .add('master product', () => ({
    template: `<div class="product-list-item list-view">
      <ish-product-item productSku="201807231" quantity="1" [configuration]="configuration"></ish-product-item>
    </div>`,
    props: { configuration },
  }))
  .add('variation product', () => ({
    template: `<div class="product-list-item list-view">
      <ish-product-item productSku="201807231-06" quantity="1" [configuration]="configuration"></ish-product-item>
    </div>`,
    props: { configuration },
  }))
  .add('sale product', () => ({
    template: `<div class="product-list-item list-view">
      <ish-product-item productSku="1612143" quantity="1" [configuration]="configuration"></ish-product-item>
    </div>`,
    props: { configuration },
  }))
  .add('bundle', () => ({
    template: `<div class="product-list-item list-view">
      <ish-product-item productSku="201807194" quantity="1" [configuration]="configuration"></ish-product-item>
    </div>`,
    props: { configuration },
  }))
  .add('retail set', () => ({
    template: `<div class="product-list-item list-view">
      <ish-product-item productSku="M4548736000919" quantity="1" [configuration]="configuration"></ish-product-item>
    </div>`,
    props: { configuration },
  }));
