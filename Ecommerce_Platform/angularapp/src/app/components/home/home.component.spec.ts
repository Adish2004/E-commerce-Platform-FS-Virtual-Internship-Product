import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

// Mock ProductService
class MockProductService {
  getProducts() {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product A', description: 'Desc A', price: 100, stock: 10, salesCount: 0 },
      { id: 2, name: 'Product B', description: 'Desc B', price: 200, stock: 5, salesCount: 0, disabled: true },
    ];
    return of(mockProducts);
  }
}

// Mock CartService
class MockCartService {
  addToCart(product: Product) {}
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let cartService: MockCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule], // ✅ Include FormsModule
      declarations: [HomeComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: CartService, useClass: MockCartService }
      ]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as unknown as MockCartService;
    fixture.detectChanges();
  });

  fit('Frontend_HomeComponent_should_create', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_HomeComponent_should_load_products_on_init_and_filter_out_disabled', () => {
    component.ngOnInit();
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(1);
  });

  fit('Frontend_HomeComponent_should_calculate_totalPages_correctly', () => {
    component.itemsPerPage = 1;
    component.applyFilters();
    expect(component.totalPages).toBe(1);
    expect(component.pages).toEqual([1]);
  });

  fit('Frontend_HomeComponent_should_reset_filters', () => {
    component.searchTerm = 'test';
    component.sortOrder = 'asc';
    component.minPrice = 50;
    component.maxPrice = 150;
    component.resetFilters();
    expect(component.searchTerm).toBe('');
    expect(component.sortOrder).toBe('');
    expect(component.minPrice).toBeNull();
    expect(component.maxPrice).toBeNull();
  });

  fit('Frontend_HomeComponent_should_call_addToCart_on_CartService', () => {
    spyOn(cartService, 'addToCart');
    const product: Product = { id: 1, name: 'Product A', description: 'Desc A', price: 100, stock: 10, salesCount: 0 };
    spyOn(window, 'alert');
    component.addToCart(product);
    expect(cartService.addToCart).toHaveBeenCalledWith(product);
    expect(window.alert).toHaveBeenCalledWith('Product A added to cart!');
  });
});
