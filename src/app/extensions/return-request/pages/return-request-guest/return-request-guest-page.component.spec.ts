import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ReturnRequestFacade } from '../../facades/return-request.facade';

import { ReturnRequestGuestPageComponent } from './return-request-guest-page.component';

describe('Return Request Guest Page Component', () => {
  let component: ReturnRequestGuestPageComponent;
  let fixture: ComponentFixture<ReturnRequestGuestPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), ReturnRequestGuestPageComponent],
      providers: [{ provide: ReturnRequestFacade, useFactory: () => instance(mock(ReturnRequestFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRequestGuestPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
