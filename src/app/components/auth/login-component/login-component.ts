import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { GoogleOauth } from '../../../services/oauth/google-oauth';

@Component({
  selector: 'app-login-component',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private googleOauth: GoogleOauth
  ) {}

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    rememberMe: new FormControl(false),
  });

  onSubmit() {
    const formData = {
      email: this.form.controls.email.value || '',
      password: this.form.controls.password.value || '',
      rememberMe: this.form.controls.rememberMe.value || false,
    }

    if (this.form.valid) {
      this.authService.login(formData).subscribe({
        next: (response: any) => {
          let token = response.token;
          this.authService.setCookie(token);

          console.log('Inicio de sesión exitoso', response);
          
          this.form.reset();
        },
        error: (error) => {
          console.error('Error en el inicio de sesión', error);
        }
      });
    }
  }

  declare google: any;

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: "34673777282-0i68o5seih3unl80fbat9a49qerog1k2.apps.googleusercontent.com",
      callback: this.handleCredentialResponse.bind(this)
    });
    // Render button or use One Tap prompt
    google.accounts.id.renderButton(
      document.getElementById("google-button"),
      { theme: "outline", size: "large" } 
    );
  }

  handleCredentialResponse(response: any): void {
    const idToken = response.credential;
    // Send this token to your Express backend for verification and user authentication
    this.google.googleLogin(idToken).subscribe(/* ... handle login ... */);
  }
}
