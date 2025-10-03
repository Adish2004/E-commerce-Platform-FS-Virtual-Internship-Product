import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminAddComponent } from './admin-add.component';
import { ProductService } from '../../services/product.service';

describe('AdminAddComponent', () => {
  let component: AdminAddComponent;
  let fixture: ComponentFixture<AdminAddComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['addProduct']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule], 
      declarations: [AdminAddComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('Frontend_AdminAddComponent_should_create_component', () => {
    expect(component).toBeTruthy();
  });

  fit('Frontend_AdminAddComponent_should_not_call_service_when_fields_are_invalid', () => {
    spyOn(window, 'alert');
    component.product = { name: '', description: '', price: 0, stock: 0, salesCount: 0 };

    component.saveProduct();

    expect(window.alert).toHaveBeenCalledWith('❌ Please fill all required fields correctly!');
    expect(productServiceSpy.addProduct).not.toHaveBeenCalled();
  });

  fit('Frontend_AdminAddComponent_should_call_service_when_fields_are_valid', () => {
    spyOn(window, 'alert');
    const mockProduct = {
      name: 'Laptop',
      description: 'Gaming Laptop',
      price: 50000,
      stock: 5,
      salesCount: 0,
    };

    productServiceSpy.addProduct.and.returnValue(of(mockProduct));
    component.product = mockProduct;

    component.saveProduct();

    expect(productServiceSpy.addProduct).toHaveBeenCalledWith(mockProduct);
    expect(window.alert).toHaveBeenCalledWith('✅ Product added successfully!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/adminlist']);
  });
});
