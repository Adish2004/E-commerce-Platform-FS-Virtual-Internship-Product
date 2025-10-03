import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminFormComponent } from './components/admin-form/admin-form.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { AdminAddComponent } from './components/admin-add/admin-add.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: CartComponent },
  { path: 'profile', component: ProfileComponent },

  // Admin routes
  { path: 'adminlist', component: AdminListComponent },
  { path: 'adminform/add', component: AdminAddComponent },       // Add product
  { path: 'adminform/edit/:id', component: AdminFormComponent }, // Edit product

  { path: '**', redirectTo: 'home' }, // fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
