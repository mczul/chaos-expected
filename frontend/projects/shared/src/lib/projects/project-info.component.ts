import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Project} from "./project.service";
import {formatDistance, formatDistanceToNow, parseISO} from 'date-fns';

@Component({
  selector: 'ce-project-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-info.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectInfoComponent {

  @Input()
  info!: Project.Info;

  get created(): string {
    return formatDistanceToNow(parseISO(this.info.createdAt));
  }

  get duration(): string {
    return formatDistance(parseISO(this.info.startsAt), parseISO(this.info.endsAt));
  }

  get startsIn(): string {
    return formatDistanceToNow(parseISO(this.info.startsAt));
  }

}
