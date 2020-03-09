import { moduleMetadata, storiesOf } from '@storybook/angular';
import { of } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Price } from 'ish-core/models/price/price.model';
import { MiniBasketComponent } from 'ish-shell/header/mini-basket/mini-basket.component';

import { defaultModuleMetadata } from './storybook-helper';

storiesOf('ish-mini-basket/empty', module)
  .addDecorator(
    moduleMetadata({
      imports: defaultModuleMetadata.imports,
      providers: [
        ...defaultModuleMetadata.providers,
        {
          provide: CheckoutFacade,
          useValue: {
            basketItemCount$: of(0),
            basketItemTotal$: of({ value: 0, currency: 'USD', type: 'Money' } as Price),
            basketLineItems$: of([] as LineItemView[]),
            basketError$: of(),
            basketChange$: of(),
          } as CheckoutFacade,
        },
      ],
    })
  )
  .add('view: small', () => ({
    component: MiniBasketComponent,
    props: {
      view: 'small',
    } as MiniBasketComponent,
  }))
  .add('view: full', () => ({
    component: MiniBasketComponent,
    props: {
      view: 'full',
    } as MiniBasketComponent,
  }))
  .add('view: auto', () => ({
    component: MiniBasketComponent,
    props: {
      view: 'auto',
    } as MiniBasketComponent,
  }));

storiesOf('ish-mini-basket/items', module)
  .addDecorator(
    moduleMetadata({
      imports: defaultModuleMetadata.imports,
      providers: [
        ...defaultModuleMetadata.providers,
        {
          provide: CheckoutFacade,
          useValue: {
            basketItemCount$: of(1),
            basketItemTotal$: of({ value: 123.45, currency: 'USD', type: 'Money' } as Price),
            basketLineItems$: of([
              {
                productSKU: '201807171',
                quantity: { value: 1 },
              },
            ] as LineItemView[]),
            basketError$: of(),
            basketChange$: of(),
          } as CheckoutFacade,
        },
      ],
    })
  )
  .add('view: small', () => ({
    component: MiniBasketComponent,
    props: {
      view: 'small',
    } as MiniBasketComponent,
  }))
  .add('view: full', () => ({
    component: MiniBasketComponent,
    props: {
      view: 'full',
    } as MiniBasketComponent,
  }))
  .add('view: auto', () => ({
    component: MiniBasketComponent,
    props: {
      view: 'auto',
    } as MiniBasketComponent,
  }));

// @Component({
//   template: `
//     <div class="header-utility">
//       <ish-mini-basket [view]="view"></ish-mini-basket>
//     </div>
//   `,
// })
// // tslint:disable-next-line: project-structure
// export class MiniBasketWrapperComponent {
//   @Input() view: string;
// }

storiesOf('ish-mini-basket/wrap', module)
  .addDecorator(
    moduleMetadata({
      // declarations: [MiniBasketWrapperComponent],
      imports: defaultModuleMetadata.imports,
      providers: [
        ...defaultModuleMetadata.providers,
        {
          provide: CheckoutFacade,
          useValue: {
            basketItemCount$: of(1),
            basketItemTotal$: of({ value: 123.45, currency: 'USD', type: 'Money' } as Price),
            basketLineItems$: of([
              {
                productSKU: '201807171',
                quantity: { value: 1 },
              },
            ] as LineItemView[]),
            basketError$: of(),
            basketChange$: of(),
          } as CheckoutFacade,
        },
      ],
    })
  )
  .add('view: small', () => ({
    template: `
    <div class="header-utility">
      <ish-mini-basket view="small"></ish-mini-basket>
    </div>
  `,
    // component: MiniBasketWrapperComponent,
    // props: {
    //   view: 'small',
    // } as MiniBasketWrapperComponent,
  }))
  .add('view: full', () => ({
    template: `
    <div class="header-utility">
      <ish-mini-basket view="full"></ish-mini-basket>
    </div>
  `,
    // component: MiniBasketWrapperComponent,
    // props: {
    //   view: 'full',
    // } as MiniBasketWrapperComponent,
  }));
// .add('view: auto', () => ({
//   component: MiniBasketWrapperComponent,
//   props: {
//     view: 'auto',
//   } as MiniBasketWrapperComponent,
// }));
