import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'cartItems';

  // BehaviorSubject for reactive cart count
  private cartCountSubject = new BehaviorSubject<number>(this.getCartCount());
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {}

  // Get cart items
  getCartItems(): any[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  // Add product to cart
  addToCart(product: any) {
    const cart = this.getCartItems();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartCount();
  }

  // ✅ Update entire cart
  updateCart(cart: any[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartCount();
  }

  // Remove item
  removeFromCart(index: number) {
    const cart = this.getCartItems();
    cart.splice(index, 1);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartCount();
  }

  // Clear cart
  clearCart() {
    localStorage.removeItem(this.cartKey);
    this.updateCartCount();
  }

  // Get total count
  getCartCount(): number {
    return this.getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  // Update count in BehaviorSubject
  private updateCartCount() {
    this.cartCountSubject.next(this.getCartCount());
  }
}
