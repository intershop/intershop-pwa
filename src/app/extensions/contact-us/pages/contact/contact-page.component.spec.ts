import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { ContactUsFacade } from '../../facades/contact-us.facade';

import { ContactPageComponent } from './contact-page.component';

describe('Contact Page Component', () => {
  let component: ContactPageComponent;
  let fixture: ComponentFixture<ContactPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPageComponent, TranslateModule.forRoot()],
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
