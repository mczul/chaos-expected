import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectInfo} from "./project.service";

@Component({
  selector: 'ce-project-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-info.component.html',
  styles: [
  ]
})
export class ProjectInfoComponent {

  @Input()
  info!: ProjectInfo;


}
