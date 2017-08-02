import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparePageComponent } from './compare-page.component';

describe('ComparePageComponent', () => {
  let component: ComparePageComponent;
  let fixture: ComponentFixture<ComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
