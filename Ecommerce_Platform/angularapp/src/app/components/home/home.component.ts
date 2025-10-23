import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  pages: number[] = [];

  // Filters
  searchTerm: string = '';
  sortOrder: 'asc' | 'desc' | '' = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
      },
      error: (err) => console.error('❌ Error fetching products:', err)
    });
  }

  applyFilters(): void {
    let filtered = this.products.filter(p => !p.disabled);

    if (this.searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
    if (this.minPrice !== null) filtered = filtered.filter(p => p.price >= this.minPrice!);
    if (this.maxPrice !== null) filtered = filtered.filter(p => p.price <= this.maxPrice!);

    if (this.sortOrder === 'asc') filtered.sort((a,b) => a.price - b.price);
    else if (this.sortOrder === 'desc') filtered.sort((a,b) => b.price - a.price);

    this.filteredProducts = filtered;

    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    this.currentPage = 1; // reset to first page after filtering
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.sortOrder = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.applyFilters();
  }

  // Pagination helpers
  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    alert(`${product.name} added to cart!`);
  }
}
