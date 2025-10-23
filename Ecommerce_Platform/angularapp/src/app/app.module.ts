import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';           
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileComponent } from './components/profile/profile.component'; 
import { MatIconModule } from '@angular/material/icon';
// import { AdminComponent } from './components/admin/admin.component';
import { AdminFormComponent } from './components/admin-form/admin-form.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { AdminAddComponent } from './components/admin-add/admin-add.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    LoginComponent,
    SignupComponent,
    NavbarComponent,
    FooterComponent,
    ProfileComponent,
    // AdminComponent,
    AdminFormComponent,
    AdminListComponent,
    AdminAddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,  
    ReactiveFormsModule, 
    MatIconModule,    
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
