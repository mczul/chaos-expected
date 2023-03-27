import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegistrationInfo} from "./registration.service";

@Component({
  selector: 'ce-registration-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-info.component.html',
  styles: [
  ]
})
export class RegistrationInfoComponent {
  @Input()
  info!: RegistrationInfo;

}
