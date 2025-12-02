import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth-service';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-nav-component',
  imports: [RouterLink],
  templateUrl: './nav-component.html',
  styleUrl: './nav-component.css',
})
export class NavComponent implements OnInit {
  constructor(
    private authService: AuthService
  ) { }

  user: any = {
    username: null,
    email: null
  }

  ngOnInit(): void {
    const token = this.authService.getToken() || null

    if (token) {
      this.authService.user(token).subscribe({
        next: (response: any) => {
          this.user.username = response.user.username
          this.user.email = response.user.email
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }
}
