import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    salesCount: 0,
    image: ''
  };

  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      alert('❌ No product ID found!');
      this.router.navigate(['/adminlist']);
    }
  }

  private loadProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product = { ...prod };
        this.previewImage = prod.image || null;
      },
      error: (err) => console.error('❌ Failed to load product:', err)
    });
  }

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

  updateProduct() {
    if (!this.product.name || !this.product.description || this.product.price <= 0) {
      alert('❌ Please fill all required fields correctly!');
      return;
    }

    if (this.previewImage) {
      this.product.image = this.previewImage.toString();
    }

    if (this.product.id) {
      this.productService.updateProduct(this.product.id, this.product).subscribe({
        next: () => {
          alert('✅ Product updated successfully!');
          this.router.navigate(['/adminlist']);
        },
        error: (err) => console.error('❌ Update failed:', err)
      });
    } else {
      alert('❌ Invalid product ID!');
    }
  }
}
