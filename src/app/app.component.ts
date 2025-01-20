import {Component, ElementRef, OnInit, viewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductService } from './services/product.service';
import { Product } from './models/product.model';
import {ProductSectionComponent} from './product-section/product-section.component';
import {ErrorResponse} from './models/error.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ProductFormComponent, ProductSectionComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'junior-technical-assesment';
  selectedProduct?: Product;
  products: Product[] = [];
  isLoading = false;
  /** The error messages to display */
  errors: string[] = [];
  /** The element reference to the error popup */
  errorPopup = viewChild.required<ElementRef<HTMLDialogElement>>('errorPopup');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  onSaveProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.selectedProduct = undefined;
        },
        error: (error) => this.handleError(error)
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  onEditProduct(product: Product): void {
    this.selectedProduct = product;
  }

  onDeleteProduct(product: Product): void {
    this.productService.deleteProduct(product.id).subscribe({
      next: (success) => {
        if (success) {
          this.loadProducts();
        }
      },
      error: (error) => console.error('Error deleting product:', error)
    });
  }

  onCancelForm(): void {
    this.selectedProduct = undefined;
  }

  /**
   * Extracts the error messages from the response and opens the error modal
   *
   * @param errorResponse - the error response to be handled
   * @private
   */
  private handleError(errorResponse: ErrorResponse): void {
    this.errors = errorResponse.errors;
    this.errorPopup().nativeElement.showModal();
  }
}
