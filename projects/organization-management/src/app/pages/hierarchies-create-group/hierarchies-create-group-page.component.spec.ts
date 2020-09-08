import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { GroupFormComponent } from '../../components/hierarchies/group-form/group-form.component';
import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { HierarchiesCreateGroupPageComponent } from './hierarchies-create-group-page.component';

describe('Hierarchies Create Group Page Component', () => {
  let component: HierarchiesCreateGroupPageComponent;
  let fixture: ComponentFixture<HierarchiesCreateGroupPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  let fb: FormBuilder;

  beforeEach(async(() => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        HierarchiesCreateGroupPageComponent,
        MockComponent(GroupFormComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchiesCreateGroupPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fb).toBeTruthy();
  });
});
