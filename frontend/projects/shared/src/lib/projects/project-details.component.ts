import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Project} from "./project.service";
import {BehaviorSubject, filter, finalize, Subject, switchMap, takeUntil, tap} from "rxjs";
import {Registration, RegistrationService} from "../registrations/registration.service";
import {ProjectInfoComponent} from "./project-info.component";
import {RegistrationCreateEvent, RegistrationFormComponent} from "../registrations/registration-form.component";
import {environment} from "../../../../form/src/environments/environment";
import {RegistrationListComponent} from "../registrations/registration-list.component";

@Component({
  selector: 'ce-project-details',
  standalone: true,
  imports: [
    CommonModule,
    ProjectInfoComponent,
    RegistrationFormComponent, RegistrationListComponent
  ],
  templateUrl: './project-details.component.html',
  styles: []
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  protected readonly _unsubscribe$ = new Subject<void>();

  protected readonly _projectCtrl$ = new BehaviorSubject<Project.Info | null>(null);
  protected readonly _project = this._projectCtrl$.asObservable();

  protected readonly _registrationsCtrl$ = new BehaviorSubject<Registration.Info[]>([]);
  protected readonly registrations = this._registrationsCtrl$.asObservable();

  protected registrationsLoaded = false;
  protected registrationActive = false;

  @Input()
  set project(source: Project.Info | null) {
    this._projectCtrl$.next(source);
  }

  get project() {
    return this._projectCtrl$.value;
  }

  @Output()
  registrationSelection = new EventEmitter<Registration.Coordinates>();

  constructor(
    protected registrationService: RegistrationService,
  ) {
  }

  ngOnInit(): void {
    // Project changed...
    this._project.pipe(
      takeUntil(this._unsubscribe$),
      filter(project => !!project),
      tap(project => console.warn(`[ProjectDetailsComponent] Project changed.`, project)),
      switchMap(project => this.registrationService.loadKnown(
          environment.apiUrl,
          project!.id
        )
      ),
    ).subscribe({
      next: registrations => {
        console.warn(`[ProjectDetailsComponent] Loaded known registrations for project.`, registrations);
        if (!!registrations) {
          this._registrationsCtrl$.next(registrations);
        }
      },
      error: err => {
        console.error(`[ProjectDetailsComponent] Failed to fetch registrations for current project.`, err);
      },
    });

    // Registrations changed...
    this.registrations.pipe(
      takeUntil(this._unsubscribe$),
      tap(registrations => console.warn(`[ProjectDetailsComponent] Registrations changed.`, registrations)),
    ).subscribe({
      next: () => this.registrationsLoaded = true,
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  protected handleNewRegistration(event: RegistrationCreateEvent): void {
    if (!event.projectId) {
      throw new Error(`Cannot handle new registration due to missing project context.`);
    }

    this.registrationActive = true;
    this.registrationService.create(
      environment.apiUrl,
      event.projectId,
      event
    ).pipe(
      takeUntil(this._unsubscribe$),
    ).subscribe({
      next: registration => {
        const updatedRegistrations = [...this._registrationsCtrl$.value, registration];
        this._registrationsCtrl$.next(updatedRegistrations);
        this.registrationActive = false;
      },
      error: err => {
        console.error(`[ProjectDetailsComponent] Failed to create registration.`, err);
        this.registrationActive = false;
        // TODO: UX; display useful information to the user
      },
    });
  }

  protected handleRegistrationSelection(event: Registration.Coordinates) {
    console.warn(`[ProjectDetailsComponent] handleRegistrationSelection() called`, event);
    this.registrationSelection.emit(event);
  }

}
