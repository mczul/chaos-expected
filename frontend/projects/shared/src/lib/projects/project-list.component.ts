import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Project} from "./project.service";
import {ShortenUuidPipe} from "../util/shorten-uuid.pipe";
import {DistanceToNowPipe} from "../util/distance-to-now.pipe";
import {DurationPipe} from "../util/duration.pipe";

@Component({
  selector: 'ce-project-list',
  standalone: true,
  imports: [CommonModule, ShortenUuidPipe, DistanceToNowPipe, DurationPipe],
  templateUrl: './project-list.component.html',
  styles: []
})
export class ProjectListComponent {

  @Input()
  entries: ReadonlyArray<Project.Info> = [];

  @Output()
  selection = new EventEmitter<string>();

  protected handleSelection(entry: Project.Info): void {
    this.selection.emit(entry.id);
  }

}
