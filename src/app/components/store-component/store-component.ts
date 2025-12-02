import { Component } from '@angular/core';
import { NavComponent } from "./nav-component/nav-component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-store-component',
  imports: [NavComponent, RouterOutlet],
  templateUrl: './store-component.html',
  styleUrl: './store-component.css',
})
export class StoreComponent {

}
