import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestDetailPageComponent } from './return-request-detail-page.component';

describe('Return Request Detail Page Component', () => {
  let component: ReturnRequestDetailPageComponent;
  let fixture: ComponentFixture<ReturnRequestDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnRequestDetailPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRequestDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
