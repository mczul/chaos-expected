import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

export interface RegistrationCreateEvent {
  projectId: string; // a bit hacky... but useful
  emailAddress: string;
}

@Component({
  selector: 'ce-registration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration-form.component.html',
  styles: []
})
export class RegistrationFormComponent {

  protected state = new FormGroup({
    projectId: new FormControl<string>('', {validators: [Validators.required], nonNullable: true,}),
    emailAddress: new FormControl<string>('', {validators: [Validators.required, Validators.email], nonNullable: true,})
  });

  @Input()
  set projectId(value: string) {
    this.state.patchValue({projectId: value});
  }
  get projectId() {
    return this.state.controls.projectId.getRawValue();
  }

  @Output()
  protected complete = new EventEmitter<RegistrationCreateEvent>();

  protected handleSubmit(): void {
    this.complete.emit(this.state.getRawValue());
  }

}
