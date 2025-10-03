import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product, ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var Razorpay: any; // Razorpay global variable

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  private baseUrl = 'https://8080-dcebadbaaeaaec334072909bccfaccecfone.premiumproject.examly.io';

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCartItems();
  }

  increaseQty(index: number) {
    this.cartItems[index].quantity++;
    this.cartService.updateCart(this.cartItems);
  }

  decreaseQty(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.cartService.updateCart(this.cartItems);
    }
  }

  removeItem(index: number) {
    this.cartService.removeFromCart(index);
    this.loadCart(); // refresh after removing
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  increaseProductSales(product: Product, quantity: number) {
    this.productService.increaseSales(product.id!, quantity).subscribe({
      next: () => {
        product.salesCount += quantity;
        product.stock -= quantity;
      },
      error: (err) => console.error(err)
    });
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      alert("⚠️ Your cart is empty!");
      return;
    }

    const totalAmount = this.getTotal() * 100; // in paise for Razorpay

    // Razorpay options
    const options = {
      key: 'rzp_test_RJ1gSZcxNf7rPN', // replace with your Razorpay test key
      amount: totalAmount,
      currency: 'INR',
      name: 'EcoFy',
      description: 'Order Payment',
      handler: (response: any) => {
        console.log('Payment success', response);
        this.finalizeOrder(); // call backend to save order
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      notes: {
        cart: JSON.stringify(this.cartItems)
      },
      theme: {
        color: '#007bff'
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  finalizeOrder() {
    // Prepare order payload for backend
    const orderPayload = this.cartItems.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    this.http.post(`${this.baseUrl}/order`, orderPayload, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          alert("✅ Order placed successfully!");
          this.cartService.clearCart();
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          console.error("❌ Order failed:", err);
          alert("⚠️ Failed to place order. Try again!");
        }
      });
  }

  addToCart(product: Product) {
    if (product.stock <= 0) {
      alert(`❌ ${product.name} is out of stock!`);
      return;
    }
    this.cartService.addToCart(product);

    // Update backend sales & stock immediately
    this.productService.increaseSales(product.id!, 1).subscribe({
      next: () => {
        product.salesCount += 1;
        product.stock -= 1;
      },
      error: (err) => console.error(err)
    });

    alert(`${product.name} added to cart!`);
  }
}
