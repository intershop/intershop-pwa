import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

import { MaintenancePageComponent } from './maintenance-page.component';

describe('Maintenance Page Component', () => {
  let component: MaintenancePageComponent;
  let fixture: ComponentFixture<MaintenancePageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MaintenancePageComponent, MockComponent(FaIconComponent), MockDirective(ServerHtmlDirective)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
