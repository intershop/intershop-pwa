import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';

import { CopilotEmbeddedContextFacade } from '../../../facades/copilot-embedded-context.facade';
import { CopilotEmbeddedProduct } from '../../../models/copilot-embedded-product/copilot-embedded-product.model';
import { CopilotEmbeddedProductComponent } from '../copilot-embedded-product/copilot-embedded-product.component';

import { CopilotEmbeddedResultsComponent } from './copilot-embedded-results.component';

describe('Copilot Embedded Results Component', () => {
  let component: CopilotEmbeddedResultsComponent;
  let fixture: ComponentFixture<CopilotEmbeddedResultsComponent>;
  let element: HTMLElement;
  let products$: BehaviorSubject<CopilotEmbeddedProduct[]>;

  beforeEach(async () => {
    products$ = new BehaviorSubject<CopilotEmbeddedProduct[]>([]);
    const context = mock(CopilotEmbeddedContextFacade);
    when(context.select('products')).thenReturn(products$);

    await TestBed.configureTestingModule({
      declarations: [
        CopilotEmbeddedResultsComponent,
        MockComponent(CopilotEmbeddedProductComponent),
        MockDirective(ProductContextDirective),
      ],
      imports: [TranslatePipe],
      providers: [
        { provide: CopilotEmbeddedContextFacade, useFactory: () => instance(context) },
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedResultsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show the introductory message when there are no products', () => {
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-results > p').textContent.trim()).toBe(
      'copilot.embedded.results.intro'
    );
    expect(element.querySelectorAll('ish-copilot-embedded-product')).toHaveLength(0);
  });

  it('should render one product for each result', () => {
    products$.next([{ sku: 'SKU-1' }, { sku: 'SKU-2' }]);
    fixture.detectChanges();

    const products = fixture.debugElement.queryAll(By.directive(ProductContextDirective));
    expect(products).toHaveLength(2);
    expect(products.map(product => product.injector.get(ProductContextDirective).sku)).toEqual(['SKU-1', 'SKU-2']);
    expect(element.querySelectorAll('ish-copilot-embedded-product')).toHaveLength(2);
    expect(element.querySelector('.copilot-embedded-results > p')).toBeNull();
  });

  it('should emit backToChat when the back action is clicked', () => {
    const emit = jest.spyOn(component.backToChat, 'emit');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('.copilot-embedded-back-to-chat').click();

    expect(emit).toHaveBeenCalled();
  });
});
