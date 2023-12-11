import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { BasketCustomFieldsViewComponent } from './basket-custom-fields-view.component';

describe('Basket Custom Fields View Component', () => {
  let component: BasketCustomFieldsViewComponent;
  let fixture: ComponentFixture<BasketCustomFieldsViewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const appFacade = mock(AppFacade);
    when(appFacade.customFieldsForScope$('Basket')).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [BasketCustomFieldsViewComponent],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCustomFieldsViewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
