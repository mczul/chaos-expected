import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Registration} from "./registration.service";
import {ShortenUuidPipe} from "../util/shorten-uuid.pipe";
import {DistanceToNowPipe} from "../util/distance-to-now.pipe";

@Component({
  selector: 'ce-registration-list',
  standalone: true,
  imports: [CommonModule, ShortenUuidPipe, DistanceToNowPipe],
  templateUrl: './registration-list.component.html',
  styles: []
})
export class RegistrationListComponent {
  @Input()
  entries: ReadonlyArray<Registration.Info> = [];

  @Output()
  selection = new EventEmitter<Registration.Coordinates>();

  protected handleSelection(entry: Registration.Info): void {
    this.selection.emit({projectId: entry.projectId, registrationId: entry.id});
  }

}
