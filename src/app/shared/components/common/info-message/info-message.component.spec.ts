import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, verify } from 'ts-mockito';

import { MessageFacade } from 'ish-core/facades/message.facade';

import { InfoMessageComponent } from './info-message.component';

describe('Info Message Component', () => {
  let component: InfoMessageComponent;
  let fixture: ComponentFixture<InfoMessageComponent>;
  let element: HTMLElement;
  let messageFacade: MessageFacade;

  beforeEach(async () => {
    messageFacade = mock(MessageFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [InfoMessageComponent],
      providers: [{ provide: MessageFacade, useFactory: () => instance(messageFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMessageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render a message if no message occurs', () => {
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('should render a message if a message occurs and toast is false', () => {
    component.message = 'Test Message';
    component.toast = false;

    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('should trigger info toast if a message occurs and toast is true', () => {
    component.message = 'Test Message';
    component.toast = true;

    component.ngOnChanges();
    fixture.detectChanges();
    verify(messageFacade.info(anything())).once();
  });
});
