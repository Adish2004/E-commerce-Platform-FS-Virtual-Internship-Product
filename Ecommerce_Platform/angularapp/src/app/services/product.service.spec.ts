import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ✅ Test 1: Service creation
  fit('Frontend_ProductService_should_be_created', () => {
    expect(service).toBeTruthy();
  });

  // ✅ Test 2: Should fetch products
  fit('Frontend_ProductService_should_fetch_all_products', () => {
    const dummyProducts: Product[] = [
      { id: 1, name: 'Laptop', description: '', price: 50000, stock: 10, salesCount: 50 },
      { id: 2, name: 'Phone', description: '', price: 20000, stock: 15, salesCount: 80 }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/adminlist`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  // ✅ Test 3: Should add a product
  fit('Frontend_ProductService_should_add_a_product', () => {
    const newProduct: Product = { name: 'Tablet', description: '', price: 15000, stock: 5, salesCount: 0 };
    
    service.addProduct(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/adminform/add`);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  // ✅ Test 4: Should update a product
  fit('Frontend_ProductService_should_update_a_product', () => {
    const updatedProduct: Product = { id: 1, name: 'Laptop Pro', description: '', price: 60000, stock: 8, salesCount: 55 };

    service.updateProduct(1, updatedProduct).subscribe(product => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/adminform/edit/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  // ✅ Test 5: Should delete a product
  fit('Frontend_ProductService_should_delete_a_product', () => {
    service.deleteProduct(1).subscribe(response => {
      expect(response).toBeNull(); 
    });
  
    const req = httpMock.expectOne(`${service['baseUrl']}/adminlist/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
