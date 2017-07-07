import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

import { TranslateService } from "@ngx-translate/core";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CategoriesService } from "app/services/categories.service";

var translate: TranslateService;

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let categories: CategoriesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        HeaderComponent 
      ],
      providers: [
        TranslateService, CategoriesService
      ],
      imports:[
        TranslateModule.forRoot()
      ]

    }).compileComponents();
  }));

  beforeEach(() => {
    categories = TestBed.get(CategoriesService);
    
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
