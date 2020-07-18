import {CoursesService} from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {COURSES ,findLessonsForCourse} from '../../../../server/db-data'
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe("CoursesService", () => {
    let coursesService: CoursesService,
        httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Phase 1: set up testing
        TestBed.configureTestingModule({
            // to test Http calls
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService,
            ]
        });

        coursesService = TestBed.get(CoursesService);
        httpTestingController = TestBed.get(HttpTestingController);
    })

    it('should retrieve all courses', () => {
        // phase 2: trigger some method of testing service
        coursesService.findAllCourses()
            .subscribe(courses => {
                // Assume our service is already serving some test data, though we will learn how to pupulate the test data later
                // phase 3: some assertion on response data from mock http calls
                expect(courses).toBeTruthy('No courses returned');
    
                expect(courses.length).toBe(12, "incorrect number of courses");
    
                const course = courses.find(course => course.id == 12);
    
                expect(course.titles.description).toBe("Angular Testing Course");
            });
        // set up the mock httpClient
        const req = httpTestingController.expectOne("/api/courses");
        // test the instance of the request to be a get request
        expect(req.request.method).toEqual("GET");
        // specify which test data should our mock httpservice should return, a mock http request
        req.flush({payload: Object.values(COURSES)});

        // to test no http calls is made
        // httpTestingController.verify();
    });

    // test for findCourseById method
    it('should find a course by id', () => {
        // phase 2: trigger some method of testing service
        coursesService.findCourseById(12)
            .subscribe(course => {

                expect(course).toBeTruthy();
                expect(course.id).toBe(12);

            });
        // set up the mock httpClient
        const req = httpTestingController.expectOne("/api/courses/12");
        // test the instance of the request to be a get request
        expect(req.request.method).toEqual("GET");
        // specify which test data should our mock httpservice return, a mock http request
        req.flush(COURSES[12]);
        
    });

    it('should save the course data', () => {
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}};

        coursesService.saveCourse(12, changes).subscribe(course => {
            expect(course.id).toBe(12);

        });
        // set mock http request
        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual("PUT");

        expect(req.request.body.titles.description).toEqual(changes.titles.description);

        req.flush({
            // changes some properties of the data, but not modify,make a copy
            ...COURSES[12],
            ...changes
        })
    });

    it('should give an error if save course fails', () => {
        const changes: Partial<Course> = {titles: {description: 'Testing Course'}};
        coursesService.saveCourse(12, changes).subscribe(
            () => {
            fail("The save course opeartion should have failed");
        }, (error: HttpErrorResponse) => {
            // internal server error
            expect(error.status).toBe(500);
            
        });
        
        // mock the httpClient
        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual("PUT");
        // (data pass back, error object)
        req.flush('Save course failed', {status: 500, statusText: 'Internal Server Error'})
    });

    it('should find a list of lessons', () => {
        coursesService.findLessons(12)
            .subscribe(lessons => {
                expect(lessons).toBeTruthy();
                expect(lessons.length).toBe(3);
            });

        const req = httpTestingController.expectOne(req => req.url == '/api/lessons');

        expect(req.request.method).toEqual("GET");
        // test the queryparams
        expect(req.request.params.get("courseId")).toEqual("12");
        expect(req.request.params.get("filter")).toEqual("");
        expect(req.request.params.get("sortOrder")).toEqual("asc");
        expect(req.request.params.get("pageNumber")).toEqual("0");
        expect(req.request.params.get("pageSize")).toEqual("3");

        // trigger the request, send back the response
        req.flush({
            payload: findLessonsForCourse(12).slice(0, 3)
        });
        
    })

    afterEach(() => {
        // to test no http calls is made
        httpTestingController.verify();
    })
    
})