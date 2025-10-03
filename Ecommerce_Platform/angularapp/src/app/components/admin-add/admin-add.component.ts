import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrls: ['./admin-add.component.css']
})
export class AdminAddComponent {
  product: Product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    salesCount: 0
  };
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    public router: Router,
    public productService: ProductService
  ) {}

  // Handle image file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
        this.product.image = reader.result?.toString() || '';
      };
      reader.readAsDataURL(file);
    }
  }

  // Save product (only Add operation)
  saveProduct() {
    if (!this.product.name || !this.product.description || this.product.price <= 0) {
      alert('❌ Please fill all required fields correctly!');
      return;
    }

    // Attach image before sending
    if (this.previewImage) {
      this.product.image = this.previewImage.toString();
    }

    this.productService.addProduct(this.product).subscribe({
      next: () => {
        alert('✅ Product added successfully!');
        this.router.navigate(['/adminlist']);
      },
      error: (err) => console.error('❌ Add failed:', err)
    });
  }
}
