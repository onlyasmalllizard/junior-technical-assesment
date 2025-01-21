import {TestBed, fakeAsync, tick, waitForAsync} from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial products', fakeAsync(() => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(3);
      expect(products[0].name).toBe('Personal Loan');
    });
    tick(500);
  }));

  it('should create a new product', fakeAsync(() => {
    const newProduct = {
      name: 'Test Product',
      description: 'Test Description',
      department: 'Test Department'
    };

    service.createProduct(newProduct).subscribe(product => {
      expect(product.name).toBe(newProduct.name);
    });
    tick(500);
  }));

  it('should delete a product', fakeAsync(() => {
    service.deleteProduct('1').subscribe(success => {
      expect(success).toBe(true);
    });
    tick(500);
  }));

  it('should update the product and not throw a "product name should be unique" error when updating a product', waitForAsync((id: string, product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    // @ts-expect-error accessing private property
    const updatedProduct = { ...service.products[0], description: 'test description' };

    service.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      // @ts-expect-error checking private property
      next: () => expect(service.products[0].description).toBe('test description'),
      error: e => fail(e)
    });
  }));

  it('should throw an error if validation errors other than the "name is unique" error occur', waitForAsync(() => {
    const updatedProduct = {
    // @ts-expect-error accessing private property
      ...service.products[0],
      description: '',
      name: '',
      department: ''
    };

    service.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      next: () => fail('Should not succeed'),
      error: e => expect(e.errors).toEqual([
        'Name is required',
        'Description is required',
        'Department is required'
      ])
    });
  }));

  it('should throw a "product name is unique" error when creating a product with a name that matches an existing one', waitForAsync(() => {
    // @ts-expect-error accessing private property
    const name = service.products[0].name;

    service.createProduct({
      name,
      description: 'test description',
      department: 'test department'
    }).subscribe({
      next: () => fail('Should not succeed'),
      error: e => expect(e.errors).toEqual(['Product name must be unique'])
    });
  }));
});
