import { Routes } from '@angular/router';
import { StoreComponent } from './components/store-component/store-component';
import { UserComponent } from './components/auth/user-component/user-component';
import { LoginComponent } from './components/auth/login-component/login-component';
import { RegisterComponent } from './components/auth/register-component/register-component';
import { ProductsComponent } from './components/store-component/products-component/products-component';

export const routes: Routes = [
  { path: '', component: StoreComponent, children: [
    { path: 'products', component: ProductsComponent },
  ]},
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent },
];
