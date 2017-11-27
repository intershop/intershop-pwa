import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRegionComponent } from './select-region.component';

describe('SelectRegionComponent', () => {
  let component: SelectRegionComponent;
  let fixture: ComponentFixture<SelectRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectRegionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
