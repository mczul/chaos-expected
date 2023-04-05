import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {BehaviorSubject, filter, finalize, map, skip, Subject, switchMap, takeUntil, tap} from "rxjs";
import {ProjectInfoComponent} from "../../../../../shared/src/lib/projects/project-info.component";
import {ProjectInfo, ProjectService} from "../../../../../shared/src/lib/projects/project.service";
import {environment} from "../../../environments/environment";
import {
  RegistrationCreateEvent,
  RegistrationFormComponent
} from "../../../../../shared/src/lib/registrations/registration-form.component";
import {RegistrationInfo, RegistrationService} from "../../../../../shared/src/lib/registrations/registration.service";
import {RegistrationInfoComponent} from "../../../../../shared/src/lib/registrations/registration-info.component";

@Component({
  selector: 'cef-project',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    ProjectInfoComponent,
    RegistrationFormComponent, RegistrationInfoComponent
  ],
  providers: [ProjectService, RegistrationService],
  templateUrl: './project.component.html',
  styles: []
})
export class ProjectComponent implements OnInit, OnDestroy {
  protected readonly _unsubscribe$ = new Subject<void>();
  protected readonly _projectCtrl$ = new BehaviorSubject<ProjectInfo | null>(null);
  protected readonly project = this._projectCtrl$.asObservable();
  protected readonly _registrationsCtrl$ = new BehaviorSubject<RegistrationInfo[]>([]);
  protected readonly registrations = this._registrationsCtrl$.asObservable();
  protected readonly _registrationsLoadedCtrl$ = new BehaviorSubject<boolean>(false);
  protected readonly registrationsLoaded = this._registrationsLoadedCtrl$.asObservable();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected projectService: ProjectService,
    protected registrationService: RegistrationService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      takeUntil(this._unsubscribe$),
      map(params => params.get('projectId')),
      map(projectId => {
        if (!projectId) {
          throw Error(`Failed to extract project id`);
        }
        return projectId;
      }),
      switchMap(projectId => this.projectService.findProjectInfo(environment.apiUrl, projectId!)),
    ).subscribe({
      next: project => this._projectCtrl$.next(project),
      error: err => {
        console.error(`[ProjectComponent] Failed to fetch project data.`, err);
        this.router.navigate(['/projects', 'not-found']);
      },
    });

    this.project.pipe(
      takeUntil(this._unsubscribe$),
      filter(project => !!project),
      tap(project => console.warn(`[ProjectComponent] Project changed.`, project)),
      switchMap(project => this.registrationService.loadKnownRegistrations(
          environment.apiUrl,
          project!.id
        )
      ),
    ).subscribe({
      next: registrations => {
        console.warn(registrations);
        if (!!registrations) {
          this._registrationsCtrl$.next(registrations);
        }
        this._registrationsLoadedCtrl$.next(true);
      },
      error: err => {
        console.error(`[ProjectComponent] Failed to fetch registrations for current project.`, err);
        this._registrationsLoadedCtrl$.next(true);
      },
    })
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  protected handleNewRegistration(event: RegistrationCreateEvent): void {
    if (!event.projectId) {
      throw new Error(`Cannot handle new registration due to missing project context.`);
    }

    this.registrationService.createRegistration(
      environment.apiUrl,
      event.projectId,
      event
    ).pipe(
      takeUntil(this._unsubscribe$)
    ).subscribe({
      next: registration => {
        const updatedRegistrations = [...this._registrationsCtrl$.value, registration];
        this._registrationsCtrl$.next(updatedRegistrations);
      },
      error: err => {
        console.error(`[ProjectComponent] Failed to create registration.`, err);
        // TODO: UX; display useful information to the user
      },
    });
  }
}
