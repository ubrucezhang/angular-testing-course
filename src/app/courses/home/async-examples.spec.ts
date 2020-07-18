import { fakeAsync, tick, flush, flushMicrotasks } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";


describe("Async Testing Examples", () => {
    
// using done is not a good way to test multiple async operations
    it("Asynchronous test example with Jasmine done()", (done: DoneFn) => {
        let test = false;

        setTimeout(() => {
        // usually test runners run this block after it cons ider the test case is completed, we need to use done: DoneFn) to let runners wait to execute this block first 
            console.log('running assertions');
            test = true;

            expect(test).toBeTruthy();
            done();
        }, 1000);
    });

    // an alternative of done callback: zone
    // use fakeAsync to include the block in zone
    it('Asynchronous test examples - setTimeout() ', fakeAsync(() => {
        let test = false;
        setTimeout(() => {});
        setTimeout(() => {
            console.log('running assertions setTimeout()');
            test = true;

            // expect(test).toBeTruthy();

        }, 1000);
        // must inside fakeAsync() block
        // give a clock for waiting the test block to be executed
        /* tick(500);
        tick(500); */
        flush();    // another way besides tick(), execute all asnyc operations before continue
        /* one pros over done callback: we don't need to write assertions inside the setTimeout() block */
        expect(test).toBeTruthy();
    }));

    // test promises
    it('Asynchronous test example - plain Promise', fakeAsync(() => {
        let test = false;
        
        console.log('Creating promise');
        // Promise.resolve().
        // setTimeout() run after promise resolve, Promise is micro tasks, has its own micro execution queue, setTimeout() is simply a task
        // setTimeout(), setInterval, mouseClick, ajax calls will be added to event loop, task queue, major tasks that can let the browser can update the DOM
        /* setTimeout(() => {
            console.log('setTimeout() first callback triggered.');
        });
        setTimeout(() => {
            console.log('setTimeout() second callback triggered.');
        }); */
        Promise.resolve().then(() => {
            console.log('Promise first then() evaluated successfully');

            return Promise.resolve();
        })
            .then(() => {
                console.log('Promise second then() evaluated successfully');
                test = true;

            });
        /* use flush() or tick() to handle the execution time */
        flushMicrotasks();

        console.log('Running test assertions');
        expect(test).toBeTruthy();
    }));

    /* test mix types of setTimeout() and promise */
    it("Asynchronous test example - Promises + setTimeout()", fakeAsync(() => {
        let counter = 0;
        Promise.resolve().then(() => {
            counter += 10;    //10
// browser can update the DOM between two major async tasks like setTimeout()
            setTimeout(() => {
                counter += 1;    //11
            }, 1000);
        });


        expect(counter).toBe(0);
        flushMicrotasks();
        expect(counter).toBe(10);
        tick(500);
        expect(counter).toBe(10);
        tick(500);
        expect(counter).toBe(11);
    }));

    /* fakeAsync() makes us can testing in a sync way, waiting the async operations done */
    it('Asynchronous test example - Observables', fakeAsync(() => {
        let test = false;
        console.log('Creating Observable');
        const test$ = of(test).pipe(delay(1000));
        test$.subscribe(() => {
            test = true;
        });
        tick(1000);
        // flush();    //flush doesn't work
        console.log('Running test assertions');
        expect(test).toBeTruthy();

    }));

});