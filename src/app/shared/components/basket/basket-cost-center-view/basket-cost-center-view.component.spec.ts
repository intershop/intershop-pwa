import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { Basket } from 'ish-core/models/basket/basket.model';

import { BasketCostCenterViewComponent } from './basket-cost-center-view.component';

describe('Basket Cost Center View Component', () => {
  let component: BasketCostCenterViewComponent;
  let fixture: ComponentFixture<BasketCostCenterViewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasketCostCenterViewComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCostCenterViewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display costCenterId', () => {
    component.data = {
      costCenter: 'CC123',
    } as Basket;

    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="additional-info-cost-center"]').textContent).toContain('CC123');
  });
});
