import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { CustomFieldsViewComponent } from './custom-fields-view.component';

describe('Custom Fields View Component', () => {
  let component: CustomFieldsViewComponent;
  let fixture: ComponentFixture<CustomFieldsViewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.customField$('field1')).thenReturn(
      of({ name: 'field1', displayName: 'Field 1', description: 'field 1 desc', type: 'String' })
    );
    when(checkoutFacade.customField$('field2')).thenReturn(
      of({ name: 'field2', displayName: 'Field 2', description: 'field 2 desc', type: 'String' })
    );
    when(checkoutFacade.customField$('field3')).thenReturn(
      of({ name: 'field3', displayName: 'Field 3', description: 'field 3 desc', type: 'String' })
    );

    await TestBed.configureTestingModule({
      imports: [CustomFieldsViewComponent],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }, provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFieldsViewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.fields = [
      { name: 'field1', value: 'Value 1' },
      { name: 'field2', value: undefined },
      { name: 'field3', value: 'Value 3' },
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display custom fields without undefined values', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <dl class="custom-fields-view">
        <div class="custom-field">
          <dt>Field 1</dt>
          <dd>Value 1</dd>
        </div>
        <div class="custom-field">
          <dt>Field 3</dt>
          <dd>Value 3</dd>
        </div>
      </dl>
    `);
  });

  it('should display custom fields with undefined values', () => {
    component.showEmpty = true;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <dl class="custom-fields-view">
        <div class="custom-field">
          <dt>Field 1</dt>
          <dd>Value 1</dd>
        </div>
        <div class="custom-field">
          <dt>Field 2</dt>
          <dd class="no-value">checkout.custom-field.no-value</dd>
        </div>
        <div class="custom-field">
          <dt>Field 3</dt>
          <dd>Value 3</dd>
        </div>
      </dl>
    `);
  });
});
