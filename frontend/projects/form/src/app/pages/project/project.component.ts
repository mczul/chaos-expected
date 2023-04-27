import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {BehaviorSubject, map, Subject, switchMap, takeUntil} from "rxjs";
import {Project, ProjectService} from "../../../../../shared/src/lib/projects/project.service";
import {environment} from "../../../environments/environment";
import {RegistrationFormComponent} from "../../../../../shared/src/lib/registrations/registration-form.component";
import {RegistrationListComponent} from "../../../../../shared/src/lib/registrations/registration-list.component";
import {ProjectDetailsComponent} from "../../../../../shared/src/lib/projects/project-details.component";

@Component({
  selector: 'cef-project',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    ProjectDetailsComponent,
    RegistrationFormComponent, RegistrationListComponent
  ],
  templateUrl: './project.component.html',
  styles: []
})
export class ProjectComponent implements OnInit, OnDestroy {
  protected readonly _unsubscribe$ = new Subject<void>();

  protected readonly _projectCtrl$ = new BehaviorSubject<Project.Info | null>(null);
  protected readonly project = this._projectCtrl$.asObservable();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected projectService: ProjectService,
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
      switchMap(projectId => this.projectService.findInfo(environment.apiUrl, projectId)),
    ).subscribe({
      next: project => this._projectCtrl$.next(project),
      error: err => {
        console.error(`[ProjectComponent] Failed to fetch project data.`, err);
        this.router.navigate(['/projects', 'not-found']);
      },
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
