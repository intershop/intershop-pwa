import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormlyForm } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { CostCentersFilterComponent } from './cost-centers-filter.component';

describe('Cost Centers Filter Component', () => {
  let component: CostCentersFilterComponent;
  let fixture: ComponentFixture<CostCentersFilterComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent(FormlyForm), ReactiveFormsModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [CostCentersFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCentersFilterComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
