import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Project} from "./project.service";
import {ShortenUuidPipe} from "../util/shorten-uuid.pipe";
import {DurationPipe} from "../util/duration.pipe";
import {DistanceToNowPipe} from "../util/distance-to-now.pipe";

@Component({
  selector: 'ce-project-info',
  standalone: true,
  imports: [CommonModule, ShortenUuidPipe, DurationPipe, DistanceToNowPipe],
  templateUrl: './project-info.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectInfoComponent {

  @Input()
  info!: Project.Info;

}
