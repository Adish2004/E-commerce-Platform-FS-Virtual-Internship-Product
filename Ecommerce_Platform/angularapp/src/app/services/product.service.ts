import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  salesCount: number;
  image?: string; // base64 preview for GET
  disabled?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://8080-dcebadbaaeaaec334072909bccfaccecfone.premiumproject.examly.io';

  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/adminlist`);
  }

  // Add a new product using FormData
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/adminform/add`, product);
  }
  
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/adminform/edit/${id}`, product);
  }

  // // Get a single product by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/adminlist/edit/${id}`);
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/adminlist/${id}`);
  }

  // Toggle enable/disable product
  toggleProduct(id: number): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/adminlist/toggle/${id}`, {});
  }

  // Increase sales count after purchase
  increaseSales(id: number, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/order`, [{ id, quantity }]);
  }
}
