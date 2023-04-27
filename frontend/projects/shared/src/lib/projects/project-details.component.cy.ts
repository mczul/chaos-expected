import {ProjectDetailsComponent} from './project-details.component'
import {Project} from "./project.service";
import {HttpClientModule} from "@angular/common/http";
import {LOCAL_STORAGE_KEY_REGISTRATIONS, Registration} from "../registrations/registration.service";
import {createOutputSpy} from "cypress/angular";


describe('ProjectDetailsComponent', () => {
  it('should handle initial visit and default registration', () => {
    // given
    const givenProject: Project.Info = {
      id: 'a1000000-0000-0000-0000-000000000001',
      name: 'My ordinary project title',
      description: 'This is the description of my ordinary project.',
      startsAt: '2023-01-02T03:04:05.000Z',
      endsAt: '2023-02-03T04:05:06.000Z',
      createdAt: '2022-11-12T01:02:03.000Z',
    };
    const givenRegistration: Registration.Info = {
      id: 'b1000000-0000-0000-0000-000000000002',
      emailAddress: 'max.mustermann@gmail.com',
      projectId: givenProject.id,
      createdAt: '2022-11-22T01:02:03.000Z',
    }
    const expectedRegistrationCoordinates: Registration.Coordinates = Registration.toCoordinates(givenRegistration);

    // when
    cy.clearAllLocalStorage();
    cy.mount(`<ce-project-details [project]="project" (registrationSelection)="onRegistrationSelection($event)" />`, {
      imports: [
        ProjectDetailsComponent,
        HttpClientModule,
      ],
      componentProperties: {
        project: givenProject,
        onRegistrationSelection: createOutputSpy<Registration.Coordinates>('registrationSelectionSpy'),
      }
    });

    // then
    //  => Global
    cy.get('ce-project-info').should('be.visible');
    cy.get('ce-project-info').should('contain.text', givenProject.name)
    cy.get('ce-registration-form').should('be.visible');
    cy.get('ce-registration-form input[type=email]').should('be.focused');
    cy.get('ce-registration-form button[type=submit]').should('be.disabled');
    cy.get('@registrationSelectionSpy').should('not.have.been.called');

    //  => Registration
    cy.intercept('POST', `/api/meta/projects/${givenProject.id}/registrations`, givenRegistration).as('postRegistration');

    cy.get('ce-registration-form input[type=email]').type(givenRegistration.emailAddress);
    cy.get('ce-registration-form button[type=submit]').should('not.be.disabled').click();
    // cy.get('ce-registration-form button[type=submit]').should('be.disabled');
    cy.wait(['@postRegistration']);

    cy.get('ce-registration-list > .card--clickable')
      .should('be.visible')
      .and('contain.text', givenRegistration.emailAddress)
    const knownRegistrations = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_REGISTRATIONS) ?? '[]');
    cy.log(knownRegistrations, expectedRegistrationCoordinates);
    // expect(knownRegistrations).eq([givenRegistration.id]);
    // cy.getAllLocalStorage()
    //   .then(data => expect(data).to.contain(expectedRegistrationCoordinates));

  });
});
