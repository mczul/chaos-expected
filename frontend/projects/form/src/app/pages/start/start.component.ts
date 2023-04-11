import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {environment} from "../../../environments/environment";
import {Subject} from "rxjs";
import {ProjectService} from "../../../../../shared/src/lib/projects/project.service";

@Component({
  selector: 'cef-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styles: []
})
export class StartComponent implements OnInit, OnDestroy {
  protected _unsubscribe$ = new Subject<void>();
  protected apiUrl = environment.apiUrl;

  constructor(protected projectService: ProjectService) {
  }

  ngOnInit(): void {
    // load known projects
    this.projectService
  }

  ngOnDestroy(): void {
  }

}
