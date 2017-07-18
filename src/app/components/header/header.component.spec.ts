import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CategoriesService } from 'app/services/categories.service';
import { Category } from 'app/services/category';

describe('HeaderComponent', () => {
  let translate: TranslateService;
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let categories: CategoriesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent
      ]
      ,
      imports: [
        TranslateModule.forRoot()
      ]
    }).overrideComponent(HeaderComponent, {
      set: {
        providers: [
          TranslateService, { provide: CategoriesService, useClass: CategoriesServiceStub }
        ]
      }
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    categories = fixture.debugElement.injector.get(CategoriesService);
    translate = fixture.debugElement.injector.get(TranslateService);
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
    fixture.detectChanges();
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  class CategoriesServiceStub {

    private categoriesUrl = 'protocol://localhost';

    getCategories(): Promise<Category[]> {
      const cs: Category[] = [];
      return Promise.resolve(cs);
    }

    getCategory(id: string): Promise<Category> {
      const c: Category = {
        id: 'Mock',
        name: 'Mock'
      };
      return Promise.resolve(c);
    }

  }

});
