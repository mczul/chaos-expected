import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {environment} from "../../../environments/environment";
import {Subject, takeUntil} from "rxjs";
import {Project, ProjectService} from "../../../../../shared/src/lib/projects/project.service";
import {ProjectInfoComponent} from "../../../../../shared/src/lib/projects/project-info.component";

@Component({
  selector: 'cef-start',
  standalone: true,
  imports: [CommonModule, ProjectInfoComponent],
  templateUrl: './start.component.html',
  styles: []
})
export class StartComponent implements OnInit, OnDestroy {
  protected _unsubscribe$ = new Subject<void>();
  protected apiUrl = environment.apiUrl;
  protected projects: ReadonlyArray<Project.Info> = [];

  constructor(protected projectService: ProjectService) {
  }

  ngOnInit(): void {
    // load known projects
    this.projectService.loadKnown(environment.apiUrl)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: projects => this.projects = projects,
        error: err => console.warn(`[StartComponent] Failed to load known projects.`, err),
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
