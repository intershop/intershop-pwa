import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { ContactUsFacade } from '../../facades/contact-us.facade';

import { ContactConfirmationComponent } from './contact-confirmation/contact-confirmation.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactPageComponent } from './contact-page.component';

describe('Contact Page Component', () => {
  let component: ContactPageComponent;
  let fixture: ComponentFixture<ContactPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPageComponent, TranslateModule.forRoot()],
      providers: [{ provide: ContactUsFacade, useFactory: () => instance(mock(ContactUsFacade)) }, provideRouter([])],
    })
      .overrideComponent(ContactPageComponent, {
        remove: {
          imports: [BreadcrumbComponent, ContactConfirmationComponent, ContactFormComponent, LoadingComponent],
        },
        add: {
          imports: [
            MockComponent(BreadcrumbComponent),
            MockComponent(ContactConfirmationComponent),
            MockComponent(ContactFormComponent),
            MockComponent(LoadingComponent),
          ],
        },
      })
      .compileComponents();
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
