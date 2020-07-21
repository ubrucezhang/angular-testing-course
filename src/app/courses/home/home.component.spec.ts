import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule, BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses()
    .filter(course => course.category == 'BEGINNER');

  const advancedCourses = setupCourses()
    .filter(course => course.category == 'ADVANCED');

    /* 1. we use async() here to in case some imported module will do http calls;
       2. we may use fakeAsync() here if we can ensure the components is compiled syncly*/
  beforeEach(async(() => {
  // create a mock service that provide the mock method
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses'])

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        // make sure no animations to be runned
        NoopAnimationsModule
      ],
      providers: [
        {provide: CoursesService, useValue: coursesServiceSpy}
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        // an instance of component class
        component = fixture.componentInstance;
        el = fixture.debugElement;    
        coursesService = TestBed.get(CoursesService);    
      });

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {
    // of operator: make the data an observable, and emits it immediately
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    // inform the component changes 
    fixture.detectChanges();
    // there should only be one tag group, .mat-tab-label
    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");


  });


  it("should display only advanced courses", () => {

      coursesService.findAllCourses.and.returnValue(of(advancedCourses));

      fixture.detectChanges();

      const tabs = el.queryAll(By.css(".mat-tab-label"));

      expect(tabs.length).toBe(1, "Unexpected number of tabs found");

  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(2, "Expected to find 2 tabs");
    

  });

// first async test
  it("should display advanced courses when tab clicked - fakeAsync",  fakeAsync((done: DoneFn) => {
  // how to simulate a user click
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    // .click(): test utility use test-utils.ts file
    // el.nativeElement.click(); similar to following
    click(tabs[1]);
    /* async operations e.g.: setTimeout(), setInterval(), fetch() */

    fixture.detectChanges();
    // if add assertions here, they won't work, tab switch internal has some async operations

    // tick(500);
    // flush(): empty task queue before continue
    // flush();
    tick(500);
    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
    // first expect the existence
    expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");          

    /* setTimeout(() => {
      // angular material v9 doesn't exclude elements from DOM if tab inactive, add the .mat-tab-body-active class to get the active ones
      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
      // first expect the existence
      expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
      expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");      
      // let jasmine know the testing is done
      done();
    }, 500); */

  }));

  // async() test zone, wait all async operations completed, then consider the it block completed
  // one pros async over fakeAsync is that async() supports real http request when we do testing like integration test. template need to fetch from backend(unit testing)
  it("should display advanced courses when tab clicked - async",  async(() => {
    // how to simulate a user click
      coursesService.findAllCourses.and.returnValue(of(setupCourses()));
      fixture.detectChanges();
      const tabs = el.queryAll(By.css(".mat-tab-label"));
      // .click(): test utility use test-utils.ts file
      // el.nativeElement.click(); similar to following
      click(tabs[1]);
  
      fixture.detectChanges();
      // we can't use flush() or tick() in async() since we don't have that control
      /* flush();
      tick() */
      // async() don't allow us to run assertions in sync way, it track the async operations and offer whenStable() callbacks that notify you when the async operations is done
      fixture.whenStable().then(() => {
        console.log("called whenStable()");
        const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
        // first expect the existence
        expect(cardTitles.length).toBeGreaterThan(0, "Could not find card titles");
        expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");  
      });
        
  

  
    }));

});


