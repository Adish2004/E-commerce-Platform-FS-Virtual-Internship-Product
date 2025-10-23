import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginStateService } from '../../services/login-state.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartCount: number = 0;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false; // ✅ track admin role

  constructor(
    private router: Router,
    private loginState: LoginStateService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsed = JSON.parse(user);
      this.isLoggedIn = true;
      this.isAdmin = parsed.role?.toLowerCase() === 'admin';
    }

    // Listen for login/logout
    this.loginState.loginStatus$.subscribe(status => {
      this.isLoggedIn = status;

      // Update role whenever login status changes
      const user = localStorage.getItem('currentUser');
      this.isAdmin = user ? JSON.parse(user).role?.toLowerCase() === 'admin' : false;
    });

    // Listen for cart count updates (only for regular users)
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  logout() {
    // Directly perform logout without confirmation
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.loginState.setLoginStatus(false);
    this.cartService.clearCart();
    this.cartCount = 0;
    this.router.navigate(['/login']);
  }
  
}
