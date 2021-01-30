import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { QuickorderPageComponent } from './quickorder-page.component';

describe('Quickorder Page Component', () => {
  let component: QuickorderPageComponent;
  let fixture: ComponentFixture<QuickorderPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(BreadcrumbComponent),
        MockComponent(InputComponent),
        MockComponent(LoadingComponent),
        QuickorderPageComponent,
      ],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
        { provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be always initialized with numberOfRows quick order lines', () => {
    fixture.detectChanges();

    expect(component.quickOrderlines).toHaveLength(component.numberOfRows);
  });

  it('should always delete one line', () => {
    fixture.detectChanges();
    component.deleteItem(0);
    expect(component.quickOrderlines).toHaveLength(component.numberOfRows - 1);
  });

  it('should always add one line', () => {
    fixture.detectChanges();
    component.addRows(1);
    expect(component.quickOrderlines).toHaveLength(component.numberOfRows + 1);
  });
});
