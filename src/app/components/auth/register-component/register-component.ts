import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { GoogleOauth } from '../../../services/oauth/google-oauth';

@Component({
  selector: 'app-register-component',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private googleOauthService: GoogleOauth, 
    private router: Router,
    private route: ActivatedRoute // For query params
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

  /**
   * Initiates the OAuth flow by redirecting to Google.
   */
  loginWithGoogle() {
    const authUrl = this.googleOauthService.getGoogleAuthUrl();
    window.location.href = authUrl;
  }

  /**
   * Checks for OAuth callback parameters when component loads.
   */
  ngOnInit(): void {
    // Use ActivatedRoute for better query param handling
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];

      if (token) {
        // Save the token
        this.authService.setCookie(token);
        console.log('Google OAuth successful. Token saved.');
        
        // Navigate to dashboard and clean URL
        this.router.navigate(['/dashboard'], { 
          replaceUrl: true 
        });
      } else if (error) {
        console.error('Google OAuth failed:', decodeURIComponent(error));
        this.errorMessage = 'Error al iniciar sesión con Google. Intenta nuevamente.';
        
        // Clean up URL
        this.router.navigate(['/login'], { 
          replaceUrl: true 
        });
      }
    });
  }
}
