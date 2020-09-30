import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';
import { anything, instance, mock, verify } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { MessageFacade } from 'ish-core/facades/message.facade';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { ErrorMessageComponent } from './error-message.component';

describe('Error Message Component', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;
  let element: HTMLElement;
  let messageFacade: MessageFacade;

  beforeEach(async () => {
    messageFacade = mock(MessageFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ErrorMessageComponent, MockDirective(ServerHtmlDirective)],
      providers: [{ provide: MessageFacade, useFactory: () => instance(messageFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render an error if no error occurs', () => {
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('should render an error if an error occurs and toast is false', () => {
    component.error = makeHttpError({ message: 'Test Error' });
    component.toast = false;

    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('should trigger error toast if an error occurs and toast is true', () => {
    component.error = makeHttpError({ message: 'Test Error' });
    component.toast = true;

    component.ngOnChanges();
    fixture.detectChanges();
    verify(messageFacade.error(anything())).once();
  });
});
