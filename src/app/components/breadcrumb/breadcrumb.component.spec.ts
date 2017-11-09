import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { instance, mock, when } from 'ts-mockito';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbService } from './breadcrumb.service';

describe('BreadCrumb Component', () => {
    let fixture: ComponentFixture<BreadcrumbComponent>;
    let component: BreadcrumbComponent;
    let element: HTMLElement;
    let routerMock: Router;
    let breadcrumbServiceMock: BreadcrumbService;
    beforeEach(() => {
      routerMock = mock(Router);
      breadcrumbServiceMock = mock(BreadcrumbService);

      TestBed.configureTestingModule({
        declarations: [BreadcrumbComponent],
        providers: [
          { provide: Router, useFactory: () => instance(routerMock) },
          { provide: BreadcrumbService, useFactory: () => instance(breadcrumbServiceMock) }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      fixture = TestBed.createComponent(BreadcrumbComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });

  it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
    });

    it('should push data to _urls array according to the currently activated url when initialized', () => {
      when(routerMock.events).thenReturn(Observable.of(new NavigationEnd(2, '/category/Computers', '/category/Computers')));
      when(routerMock.url).thenReturn('/category/Computers');
      component.categoryNames = [];
      component.startAfter = '';
      expect(component._urls.length).toBe(0);
      fixture.detectChanges();
      expect(component._urls.length).toBe(2);
    });

    it('should return url by replacing the IDs with their names provided in friendlyPath when inputs have been provided', () => {
      component.categoryNames = ['Cameras', 'camcorders'];
      component.startAfter = '/category/';
      const url = component.getUrlWithNames('home/category/12/256');
      expect(url).toBe('home/category/Cameras/camcorders');
    });

    it('should trim the url to last segment on receiving', () => {
      const breadcrumName = component.friendlyName('home/category/cameras');
      expect(breadcrumName).toBe('cameras');
    });

    it('should trim the last segment of url on receiving', () => {
      const breadcrumName = component.removeLastSegment('home/category/cameras');
      expect(breadcrumName).toBe('home/category');
    });

    it('should return false when no inputs are provided to the component', () => {
      component.categoryNames = [];
      component.startAfter = '';
      expect(component.inputsToBeUSed()).toBeFalsy();
    });
});
