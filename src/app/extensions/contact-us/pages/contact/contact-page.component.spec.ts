import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';

import { ContactUsFacade } from '../../facades/contact-us.facade';

import { ContactConfirmationComponent } from './contact-confirmation/contact-confirmation.component';
import { ContactPageComponent } from './contact-page.component';

describe('Contact Page Component', () => {
  let component: ContactPageComponent;
  let fixture: ComponentFixture<ContactPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        ContactPageComponent,
        MockComponent(BreadcrumbComponent),
        MockComponent(ContactConfirmationComponent),
      ],
      providers: [{ provide: ContactUsFacade, useFactory: () => instance(mock(ContactUsFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
