import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductService } from './services/product.service';
import { Observable, of, throwError } from 'rxjs';
import {ProductSectionComponent} from './product-section/product-section.component';
import {mockProducts} from './mocks/products';
import {signal} from '@angular/core';

const mockPopup = {
  nativeElement: {
    showModal: jest.fn(),
    close: jest.fn()
  }
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const mockProductService = {
      getProducts: jest.fn().mockReturnValue(of(mockProducts)),
      createProduct: jest.fn().mockImplementation((product) =>
        of({
          ...product,
          id: '3',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ),
      updateProduct: jest.fn().mockImplementation((id, product) =>
        of({
          ...product,
          id,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ),
      deleteProduct: jest.fn().mockReturnValue(of(true))
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, ProductFormComponent, ProductSectionComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    component.errorPopup = signal(mockPopup) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', fakeAsync(() => {
    component.ngOnInit();
    tick(500);
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
    expect(component.isLoading).toBe(false);
  }));

  it('should create a new product', fakeAsync(() => {
    const newProduct = {
      name: 'New Product',
      description: 'New Description',
      department: 'New Department'
    };

    component.onSaveProduct(newProduct);
    tick(500);

    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
    expect(productService.getProducts).toHaveBeenCalled();
  }));

  it('should update an existing product', fakeAsync(() => {
    const updateData = {
      name: 'Updated Product',
      description: 'Updated Description',
      department: 'Updated Department'
    };

    component.selectedProduct = mockProducts[0];
    component.onSaveProduct(updateData);
    tick(500);

    expect(productService.updateProduct).toHaveBeenCalledWith('1', updateData);
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.selectedProduct).toBeUndefined();
  }));

  it('should delete a product', fakeAsync(() => {
    component.onDeleteProduct(mockProducts[0]);
    tick(500);

    expect(productService.deleteProduct).toHaveBeenCalledWith('1');
    expect(productService.getProducts).toHaveBeenCalled();
  }));

  it('should set selected product when editing', () => {
    component.onEditProduct(mockProducts[0]);
    expect(component.selectedProduct).toEqual(mockProducts[0]);
  });

  it('should clear selected product when cancelling', () => {
    component.selectedProduct = mockProducts[0];
    component.onCancelForm();
    expect(component.selectedProduct).toBeUndefined();
  });

  it('should handle error when loading products', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.getProducts.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.ngOnInit();
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);

    consoleErrorSpy.mockRestore();
  }));

  it('should handle error when creating product', fakeAsync(() => {
    // @ts-expect-error spying on private method
    const errorHandlerSpy = jest.spyOn(component, 'handleError').mockImplementation();
    productService.createProduct.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.onSaveProduct({
      name: 'Test',
      description: 'Test',
      department: 'Test'
    });
    tick(500);

    expect(errorHandlerSpy).toHaveBeenCalled();
    errorHandlerSpy.mockRestore();
  }));

  it('should handle error when updating product', fakeAsync(() => {
    // @ts-expect-error spying on private method
    const errorHandlerSpy = jest.spyOn(component, 'handleError').mockImplementation();
    productService.updateProduct.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.selectedProduct = mockProducts[0];
    component.onSaveProduct({
      name: 'Test',
      description: 'Test',
      department: 'Test'
    });
    tick(500);

    expect(errorHandlerSpy).toHaveBeenCalled();
    errorHandlerSpy.mockRestore();
  }));

  it('should handle error when deleting product', fakeAsync(() => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    productService.deleteProduct.mockReturnValueOnce(throwError(() => new Error('Test error')));

    component.onDeleteProduct(mockProducts[0]);
    tick(500);

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  }));

  it('should store the errors and open the popup when handleError is called', () => {
    const mockError = {
      errors: ['a', 'b', 'c']
    };

    // @ts-expect-error testing private method
    component.handleError(mockError);

    expect(component.errors).toEqual(mockError.errors);
    expect(mockPopup.nativeElement.showModal).toHaveBeenCalled();
  });
});
