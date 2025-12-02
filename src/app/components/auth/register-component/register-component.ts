import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-register-component',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  constructor(
    private authService: AuthService
  ) {}

  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit() {
    const formData = {
      username: this.form.controls.username.value || '',
      email: this.form.controls.email.value || '',
      password: this.form.controls.password.value || '',
    }

    if (this.form.valid) {
      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.form.reset();
        },
        error: (error) => {
          console.error('Error en el registro', error);
        }
      });
    } else {
      console.error('Formulario inválido');
    }
  }
}
