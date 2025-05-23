import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { ManagersSelectComponent } from './managers-select.component';

describe('Managers Select Component', () => {
  let component: ManagersSelectComponent;
  let fixture: ComponentFixture<ManagersSelectComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const organizationManagementFacade = mock(OrganizationManagementFacade);

    when(organizationManagementFacade.users$).thenReturn(of([]));
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [ManagersSelectComponent],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagersSelectComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.control = new FormControl('test');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the buyers select box after creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=managers-select-box]')).toBeTruthy();
  });
});
