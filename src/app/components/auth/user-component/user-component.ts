import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-user-component',
  imports: [RouterLink],
  templateUrl: './user-component.html',
  styleUrl: './user-component.css',
})

export class UserComponent implements OnInit {
  name: string = '';
  email: string = '';
  imageUrl: string = 'https://i.pinimg.com/736x/7e/8c/81/7e8c8119bf240d4971880006afb7e1e6.jpg';
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken() || this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      console.error("No existe token en la URL");
      return;
    }

    this.authService.user(this.token).subscribe({
      next: (response: any) => {
        this.name = response.user.username;
        this.email = response.user.email;
        this.imageUrl = response.user.picture;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }
}
