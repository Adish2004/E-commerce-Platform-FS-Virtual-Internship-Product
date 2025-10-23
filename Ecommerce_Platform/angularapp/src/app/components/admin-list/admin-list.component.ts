import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  products: Product[] = [];

  searchTerm = '';
  sortOrder: 'asc' | 'desc' | '' = '';
  topN: number | null = null;

  currentPage = 1;
  productsPerPage = 5;
  totalPages = 1;

  filteredProducts: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // ✅ Fetch products
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
      },
      error: (err) => console.error('❌ Error fetching products:', err)
    });
  }

  // 🔹 Filtering
  applyFilters(): void {
    let filtered = [...this.products];

    if (this.searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.sortOrder === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (this.topN && this.topN > 0) {
      filtered = filtered.sort((a, b) => b.salesCount - a.salesCount).slice(0, this.topN);
    }

    this.totalPages = Math.ceil(filtered.length / this.productsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
    const start = (this.currentPage - 1) * this.productsPerPage;
    const end = start + this.productsPerPage;
    this.filteredProducts = filtered.slice(start, end);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.sortOrder = '';
    this.topN = null;
    this.currentPage = 1;
    this.applyFilters();
  }

  // 🔹 Pagination
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilters();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  // 🚀 Navigation
  addProduct() {
    this.router.navigate(['/adminform/add']);
  }

  editProduct(product: Product) {
    this.router.navigate(['/adminform/edit', product.id]);
  }

  // 🔹 Delete
  deleteProduct(id: number) {
    if (!confirm('⚠️ Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.applyFilters();
        alert('🗑️ Product deleted successfully!');
      },
      error: (err) => console.error('❌ Error deleting product:', err)
    });
  }

  // 🔹 Enable/Disable toggle
  toggleProduct(product: Product) {
    this.productService.toggleProduct(product.id!).subscribe({
      next: (updated) => {
        product.disabled = updated.disabled;
        alert(`✅ Product ${updated.disabled ? 'disabled' : 'enabled'} successfully!`);
        this.applyFilters();
      },
      error: (err) => console.error('❌ Error toggling product:', err)
    });
  }
}
