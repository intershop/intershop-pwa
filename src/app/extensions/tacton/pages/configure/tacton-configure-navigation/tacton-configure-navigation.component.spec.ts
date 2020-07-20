import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonNavigationTree } from '../../../models/tacton-navigation-tree/tacton-navigation-tree.model';

import { TactonConfigureNavigationComponent } from './tacton-configure-navigation.component';

describe('Tacton Configure Navigation Component', () => {
  let component: TactonConfigureNavigationComponent;
  let fixture: ComponentFixture<TactonConfigureNavigationComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;
  let shoppingFacade: ShoppingFacade;
  const tree: TactonNavigationTree = [
    {
      name: 'step1',
      description: 'step 1 description',
      children: [
        { name: 'step11', description: 'step 1.1 description' },
        { name: 'step12', description: 'step 1.2 description' },
      ],
    },
    { name: 'step2', description: 'step 2 description' },
  ];

  beforeEach(async(() => {
    expect.addSnapshotSerializer({
      test: el => el instanceof NodeList,
      print: (el: NodeList, print) => {
        let output = '';
        for (let index = 0; index < el.length; index++) {
          const a = el.item(index);
          output += (index === 0 ? '' : '\n') + print(a);
        }
        return output;
      },
    });
    expect.addSnapshotSerializer({
      test: el => el instanceof HTMLAnchorElement,
      print: (el: HTMLAnchorElement) => el.href,
    });

    tactonFacade = mock(TactonFacade);
    shoppingFacade = mock(ShoppingFacade);

    TestBed.configureTestingModule({
      declarations: [TactonConfigureNavigationComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: TactonFacade, useFactory: () => instance(tactonFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonConfigureNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render if product is missing', () => {
    when(shoppingFacade.selectedProduct$).thenReturn(EMPTY);

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should render for step-level navigation', () => {
    when(shoppingFacade.selectedProduct$).thenReturn(of({ sku: 'PRODUCT' } as ProductView));
    when(tactonFacade.groupLevelNavigationEnabled$).thenReturn(of(false));
    when(tactonFacade.configurationTree$).thenReturn(of(tree));

    fixture.detectChanges();

    expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
      http://localhost/configure/PRODUCT/step1
      http://localhost/configure/PRODUCT/step1#step11
      http://localhost/configure/PRODUCT/step1#step12
      http://localhost/configure/PRODUCT/step2
    `);
  });

  it('should render for group-level navigation', () => {
    when(shoppingFacade.selectedProduct$).thenReturn(of({ sku: 'PRODUCT' } as ProductView));
    when(tactonFacade.groupLevelNavigationEnabled$).thenReturn(of(true));
    when(tactonFacade.configurationTree$).thenReturn(of(tree));

    fixture.detectChanges();

    expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
      http://localhost/configure/PRODUCT/step1
      http://localhost/configure/PRODUCT/step1/step11
      http://localhost/configure/PRODUCT/step1/step12
      http://localhost/configure/PRODUCT/step2
    `);
  });
});
