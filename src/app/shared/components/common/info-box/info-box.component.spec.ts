import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { InfoBoxComponent } from './info-box.component';

describe('Info Box Component', () => {
  let component: InfoBoxComponent;
  let fixture: ComponentFixture<InfoBoxComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [InfoBoxComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBoxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display an edit link if no editRouterLink is given', () => {
    component.editRouterLink = undefined;
    fixture.detectChanges();
    expect(element.querySelector('[title]')).toBeFalsy();
  });

  it('should display an edit link if editRouterLink is given', () => {
    component.editRouterLink = '/checkout/address';
    fixture.detectChanges();
    expect(element.querySelector('[title]')).toBeTruthy();
  });

  it('should display a title for the given heading', () => {
    component.heading = 'Title';
    fixture.detectChanges();
    expect(element.textContent).toEqual('Title');
  });
});
