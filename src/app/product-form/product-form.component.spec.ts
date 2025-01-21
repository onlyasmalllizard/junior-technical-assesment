import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../models/product.model';
import {Subject} from 'rxjs';

const shouldResetForm$ = new Subject<boolean>;

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    component.shouldResetForm$ = shouldResetForm$;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.productForm.get('name')?.value).toBe('');
    expect(component.productForm.get('description')?.value).toBe('');
    expect(component.productForm.get('department')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.productForm;
    expect(form.valid).toBeFalsy();

    form.controls['name'].setValue('Test');
    form.controls['description'].setValue('Test Description');
    form.controls['department'].setValue('Test Department');

    expect(form.valid).toBeTruthy();
  });

  it('should validate name length', () => {
    const nameControl = component.productForm.controls['name'];

    nameControl.setValue('ab');
    expect(nameControl.errors?.['minlength']).toBeTruthy();

    nameControl.setValue('abc');
    expect(nameControl.errors).toBeNull();
  });

  it('should validate description length', () => {
    const descControl = component.productForm.controls['description'];

    descControl.setValue('short');
    expect(descControl.errors?.['minlength']).toBeTruthy();

    descControl.setValue('long enough description');
    expect(descControl.errors).toBeNull();
  });

  it('should emit save event with form data when valid', () => {
    const emitSpy = jest.spyOn(component.save, 'emit');

    component.productForm.setValue({
      name: 'Test Product',
      description: 'Test Description',
      department: 'Test Department'
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({
      name: 'Test Product',
      description: 'Test Description',
      department: 'Test Department'
    });
  });

  it('should not emit save event when form is invalid', () => {
    const emitSpy = jest.spyOn(component.save, 'emit');

    component.productForm.setValue({
      name: 'ab',
      description: 'short',
      department: ''
    });

    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit cancel event', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should reset form on cancel', () => {
    // @ts-expect-error spying on private method
    const resetFormSpy = jest.spyOn(component, 'resetForm');

    component.onCancel();

    expect(resetFormSpy).toHaveBeenCalled();
  });

  it('should populate form when product input changes', () => {
    const testProduct: Product = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      department: 'Test Department',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    component.product = testProduct;
    component.ngOnChanges({
      product: {
        currentValue: testProduct,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.productForm.get('name')?.value).toBe(testProduct.name);
    expect(component.productForm.get('description')?.value).toBe(testProduct.description);
    expect(component.productForm.get('department')?.value).toBe(testProduct.department);
  });

  it('should show error messages when form is submitted with invalid data', () => {
    component.onSubmit();
    expect(component.isSubmitted).toBe(true);
    expect(component.shouldShowError('name')).toBe(true);
    expect(component.shouldShowError('description')).toBe(true);
    expect(component.shouldShowError('department')).toBe(true);
  });

  it('should not show error messages before form submission', () => {
    expect(component.shouldShowError('name')).toBe(false);
    expect(component.shouldShowError('description')).toBe(false);
    expect(component.shouldShowError('department')).toBe(false);
  });
});
