import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito';
import { MockComponent } from '../../../mocking/components/mock.component';
import { Customer } from '../../../models/customer/customer.model';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerRegistrationService } from '../../services/customer-registration.service';
import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPage Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let location: Location;

  beforeEach(async(() => {
    const customerRegistrationServiceMock = mock(CustomerRegistrationService);
    when(customerRegistrationServiceMock.registerPrivateCustomer(anything())).thenReturn(of(new Customer()));

    TestBed.configureTestingModule({
      declarations: [RegistrationPageComponent,
        MockComponent({
          selector: 'ish-registration-form',
          template: 'Form Template',
          inputs: [
            'countries',
            'languages',
            'regions',
            'emailOptIn'
          ]
        }),
      ],
      providers: [
        { provide: CustomerRegistrationService, useFactory: () => instance(customerRegistrationServiceMock) },
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: RegistrationPageComponent }
        ]),
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    location = TestBed.get(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });


  it('should navigate to homepage when cancel is clicked', async(() => {
    expect(location.path()).toBe('', 'start location');
    component.onCancel();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/home');
    });
  }));
});
