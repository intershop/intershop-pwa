import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CustomFieldsViewComponent } from 'ish-shared/components/custom-fields/custom-fields-view/custom-fields-view.component';

import { LineItemCustomFieldsComponent } from './line-item-custom-fields.component';

describe('Line Item Custom Fields Component', () => {
  let component: LineItemCustomFieldsComponent;
  let fixture: ComponentFixture<LineItemCustomFieldsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const appFacade = mock(AppFacade);
    when(appFacade.customFieldsForScope$('BasketLineItem')).thenReturn(of([]));

    await TestBed.configureTestingModule({
      declarations: [LineItemCustomFieldsComponent, MockComponent(CustomFieldsViewComponent)],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemCustomFieldsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
