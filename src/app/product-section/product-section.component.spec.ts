import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSectionComponent } from './product-section.component';
import {mockProducts} from '../mocks/products';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

describe('ProductSectionComponent', () => {
  let component: ProductSectionComponent;
  let fixture: ComponentFixture<ProductSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSectionComponent);
    fixture.componentRef.setInput('products', mockProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct products', () => {
    mockProducts.forEach(product => {
      const title = screen.getByRole('heading', { name: product.name });
      expect(title).toBeTruthy();
    });
  });

  it('should emit the correct product when the delete button is clicked', async () => {
    const user = userEvent.setup();
    const deleteProduct = jest.spyOn(component.deleteProduct, 'emit');
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    // I prefer to use a for loop here to avoid potential complications from having an async function in a forEach
    // callback method
    for (let i = 0; i < deleteButtons.length; i++) {
      await user.click(deleteButtons[i]);
      expect(deleteProduct).toHaveBeenCalledWith(mockProducts[i]);
    }
  });

  it('should emit the correct product when the edit button is clicked', async () => {
    const user = userEvent.setup();
    const editProduct = jest.spyOn(component.editProduct, 'emit');
    const editButtons = screen.getAllByRole('button', { name: /edit/i });

    for (let i = 0; i < editButtons.length; i++) {
      await user.click(editButtons[i]);
      expect(editProduct).toHaveBeenCalledWith(mockProducts[i]);
    }
  });
});
