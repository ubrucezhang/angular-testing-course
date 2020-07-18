import {CalculatorService} from './calculator.service';
import { LoggerService } from './logger.service';
import { TestBed } from '@angular/core/testing';

// to disable whole test suite, use xdescribe, 
// xit to disable a it block 
// fdescribe/ fit: to focus on this test suite, disable other test suite for now
describe('CalculatorService', () => {

    let calculator: CalculatorService,
        loggerSpy: any;

    // each it block will execute the beforeEach 1 time
    // Phase 1: set up the test 
    // mocking all the dependency of the testing service, that's why it is unit testing, isolated testing
    beforeEach(() => {
        console.log("Calling beforeEach");
        loggerSpy = jasmine.createSpyObj('LoggerService', ["log"]);
        // if logger return some value, we can fake it
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                // inject service name, and use fake spy service by jasmine
                {provide: LoggerService, useValue: loggerSpy}
            ]
        });
        calculator = TestBed.get(CalculatorService);        
    });
    

    it('should add two numbers', () => {
        // phase 1: set up phase
        // test how many times the logggerService is called(once)
        // But we can create a fake loggerService because usually the tested service should be the only instance
        // const logger = new LoggerService();
        // spyOn(logger, 'log'); //spy on some method of logger object        
        /* const logger = jasmine.createSpyObj('LoggerService', ["log"]);
        // if logger return some value, we can fake it
        logger.log.and.returnValue();
        
        const calculator = new CalculatorService(logger); */
        // phase 2: trigger the component/service/pipes we want to test
        console.log("add test");
        const result = calculator.add(2, 2);
        // phase 3: test assertions
        expect(result).toBe(4);
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });
    
    it('should subtract two numbers', () => {

        // phase 2: trigger the component/service/pipes we want to test
        console.log("subtract test");
        const result = calculator.subtract(2, 2);
        // phase 3: test assertions
        // 
        expect(result).toBe(0, "unexpected subtraction result!");
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });


})