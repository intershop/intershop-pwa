import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../../../../core/icon.module';
import { PipesModule } from '../../../../shared/pipes.module';
import { InfoBoxComponent } from './info-box.component';

describe('Info Box Component', () => {
  let component: InfoBoxComponent;
  let fixture: ComponentFixture<InfoBoxComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, PipesModule, IconModule],
      declarations: [InfoBoxComponent],
    }).compileComponents();
  }));

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
    expect(element.querySelector('a.btn-tool')).toBeFalsy();
  });

  it('should display an edit link if editRouterLink is given', () => {
    component.editRouterLink = '/checkout/address';
    fixture.detectChanges();
    expect(element.querySelector('a.btn-tool')).toBeTruthy();
  });

  it('should display a title for the given heading', () => {
    component.heading = 'Title';
    fixture.detectChanges();
    expect(element.querySelector('h3').textContent).toEqual('Title');
  });
});
