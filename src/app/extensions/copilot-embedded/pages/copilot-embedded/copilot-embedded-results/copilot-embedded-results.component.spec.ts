import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { CopilotEmbeddedProduct } from '../../../models/copilot-embedded-product/copilot-embedded-product.model';

import { CopilotEmbeddedResultsComponent } from './copilot-embedded-results.component';

describe('Copilot Embedded Results Component', () => {
  let component: CopilotEmbeddedResultsComponent;
  let fixture: ComponentFixture<CopilotEmbeddedResultsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CopilotEmbeddedResultsComponent,
        MockComponent(ProductItemComponent),
        MockDirective(ProductContextDirective),
      ],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
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

    expect(element.querySelector('.copilot-embedded-results-intro').textContent.trim()).toBe(
      'copilot.embedded.results.intro'
    );
    expect(element.querySelectorAll('ish-product-item')).toHaveLength(0);
  });

  it('should render one row product item for each result', () => {
    const products: CopilotEmbeddedProduct[] = [{ sku: 'SKU-1' }, { sku: 'SKU-2' }];
    component.products = products;
    fixture.detectChanges();

    const productItems = fixture.debugElement.queryAll(By.directive(ProductItemComponent));
    expect(productItems).toHaveLength(2);
    expect(productItems.map(item => item.componentInstance.displayType)).toEqual(['row', 'row']);
    expect(element.querySelector('.copilot-embedded-results-intro')).toBeNull();
  });

  it('should emit backToChat when the back action is clicked', () => {
    const emit = jest.spyOn(component.backToChat, 'emit');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('.copilot-embedded-back-to-chat').click();

    expect(emit).toHaveBeenCalled();
  });
});
