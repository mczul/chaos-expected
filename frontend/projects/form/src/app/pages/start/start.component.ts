import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {environment} from "../../../environments/environment";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Project, ProjectService} from "../../../../../shared/src/lib/projects/project.service";
import {ProjectInfoComponent} from "../../../../../shared/src/lib/projects/project-info.component";
import {ProjectListComponent} from "../../../../../shared/src/lib/projects/project-list.component";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'cef-start',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectInfoComponent, ProjectListComponent],
  templateUrl: './start.component.html',
  styles: []
})
export class StartComponent implements OnInit, OnDestroy {
  protected readonly _unsubscribe$ = new Subject<void>();

  protected readonly _projectListCtrl$ = new BehaviorSubject<Project.Info[]>([]);
  protected readonly projectList = this._projectListCtrl$.asObservable();
  protected readonly _projectListLoadedCtrl$ = new BehaviorSubject<boolean>(false);
  protected readonly projectListLoaded = this._projectListLoadedCtrl$.asObservable();

  constructor(protected router: Router, protected projectService: ProjectService) {
  }

  ngOnInit(): void {
    // load known projects
    this._projectListLoadedCtrl$.next(false);
    this.projectService.loadKnown(environment.apiUrl)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: projects => {
          this._projectListCtrl$.next(projects)
          this._projectListLoadedCtrl$.next(true);
        },
        error: err => {
          console.warn(`[StartComponent] Failed to load known projects.`, err)
          this._projectListLoadedCtrl$.next(true);
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  handleProjectSelection(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

}
