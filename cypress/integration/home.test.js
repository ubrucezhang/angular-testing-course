
// to do an integration test, we should only run the front-end, no backend
describe('Home Page', () => {

    beforeEach(() => {
        cy.fixture('courses.json').as("coursesJSON");
        cy.server();    // mock server
        // link the above data to a http request
        cy.route('/api/courses', "@coursesJSON").as("courses");
        cy.visit('/');      //visit the home page
    })

    it("should display a list of courses", () => {
        
        cy.contains("All Courses");
        // mock the backend to get some test data
        // use real http request, but mock http response for datasource
        // wait for the request to complete
        cy.wait('@courses');
        // assertion
        cy.get("mat-card").should("have.length", 9);
    });

    it("should display the advanced courses", () => {
        cy.get('.mat-tab-label').should("have.length", 2);
        // click the last element of the '.mat-tab-label'
        cy.get('.mat-tab-label').last().click();
        // cypress is taking card of the async click()
        // its length should be greater than 1
        cy.get('.mat-tab-body-active .mat-card-title').its('length').should('be.gt', 1);
        cy.get('.mat-tab-body-active .mat-card-title').first()
            .should('contain', "Angular Security Course");
    });
})