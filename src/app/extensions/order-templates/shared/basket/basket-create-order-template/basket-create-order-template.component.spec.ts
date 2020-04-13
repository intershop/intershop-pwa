import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { OrderTemplatePreferencesDialogComponent } from '../../order-templates/order-template-preferences-dialog/order-template-preferences-dialog.component';
import { SelectOrderTemplateModalComponent } from '../../order-templates/select-order-template-modal/select-order-template-modal.component';

import { BasketCreateOrderTemplateComponent } from './basket-create-order-template.component';

describe('Basket Create Order Template Component', () => {
  let component: BasketCreateOrderTemplateComponent;
  let fixture: ComponentFixture<BasketCreateOrderTemplateComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketCreateOrderTemplateComponent,
        MockComponent(OrderTemplatePreferencesDialogComponent),
        MockComponent(SelectOrderTemplateModalComponent),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot(), ngrxTesting({ reducers: coreReducers })],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCreateOrderTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
