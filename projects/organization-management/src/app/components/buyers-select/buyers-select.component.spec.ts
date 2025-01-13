import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { BuyersSelectComponent } from './buyers-select.component';

describe('Buyers Select Component', () => {
  let component: BuyersSelectComponent;
  let fixture: ComponentFixture<BuyersSelectComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const organizationManagementFacade = mock(OrganizationManagementFacade);

    when(organizationManagementFacade.users$).thenReturn(of([]));
    await TestBed.configureTestingModule({
      imports: [FormlyModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [BuyersSelectComponent],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyersSelectComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.control = new FormControl('test');
    component.field = {} as FormlyFieldConfig;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the buyers select box after creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=buyers-select-box]')).toBeTruthy();
  });
});
