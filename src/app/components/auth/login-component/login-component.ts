import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { GoogleOauth } from '../../../services/oauth/google-oauth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-component',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
  standalone: true
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  
  constructor(
    private authService: AuthService,
    private googleOauthService: GoogleOauth, 
    private router: Router,
    private route: ActivatedRoute // For query params
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
          
          // Navigate to dashboard after successful login
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error en el inicio de sesión', error);
          this.errorMessage = 'Error en el inicio de sesión. Verifica tus credenciales.';
        }
      });
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