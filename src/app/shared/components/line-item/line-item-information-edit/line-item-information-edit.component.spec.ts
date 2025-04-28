import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemCustomFieldsComponent } from 'ish-shared/components/line-item/line-item-custom-fields/line-item-custom-fields.component';

import { LineItemInformationEditComponent } from './line-item-information-edit.component';

describe('Line Item Information Edit Component', () => {
  let component: LineItemInformationEditComponent;
  let fixture: ComponentFixture<LineItemInformationEditComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LineItemInformationEditComponent, MockComponent(LineItemCustomFieldsComponent)],
      providers: [{ provide: AppFacade, useFactory: () => instance(mock(AppFacade)) }],
    })
      .overrideComponent(LineItemInformationEditComponent, {
        set: { providers: [{ provide: ProductContextFacade, useFactory: () => instance(mock(ProductContextFacade)) }] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemInformationEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
