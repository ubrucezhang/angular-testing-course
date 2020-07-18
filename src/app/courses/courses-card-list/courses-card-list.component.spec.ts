import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;

  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  // async(): testing utility, wait for any async operations to be completed, at most 5s for all operations
  beforeEach(async( () => {
    TestBed.configureTestingModule({
      // has all the components like angular material, coursesCardListComponent it needed
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        // an instance of component class
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));


  it("should create the component", () => {

    expect(component).toBeTruthy();

  //  console.log(component);
    
    

  });


  it("should display the course list", () => {
    // DOM interaction
    // 1. pass some data
    component.courses = setupCourses();

    // change detection, sync way
    fixture.detectChanges();
    // 2. test if can display in the DOM
    // By: predicate: function return true of false
    // check the current DOM
    // console.log(el.nativeElement.outerHTML);

    const cards = el.queryAll(By.css(".course-card"))
    // some assertions
    // this one should after the html is loaded
    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpected number of courses");

  });


  it("should display the first course", () => {

      component.courses = setupCourses();

      fixture.detectChanges();
      // assertions
      const course = component.courses[0];
      // sudo class
      const card = el.query(By.css(".course-card:first-child")),
            title = card.query(By.css("mat-card-header")),
            image = card.query(By.css("img"));

      expect(card).toBeTruthy("Could not find course card");

      expect(title.nativeElement.textContent).toBe(course.titles.description);

      expect(image.nativeElement.src).toBe(course.iconUrl);
  });


});


