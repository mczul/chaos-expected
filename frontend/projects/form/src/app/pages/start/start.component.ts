import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'cef-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start.component.html',
  styles: []
})
export class StartComponent {

  protected apiUrl = environment.apiUrl;

}
