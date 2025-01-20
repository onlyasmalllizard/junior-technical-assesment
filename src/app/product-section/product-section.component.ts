import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {Product} from '../models/product.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [
    DatePipe,
  ],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.scss'
})
export class ProductSectionComponent {
  /** The products to display in the section */
  public products: InputSignal<Product[]> = input.required<Product[]>();
  /** The event emitter to edit a product */
  public editProduct: OutputEmitterRef<Product> = output<Product>();
  /** The event emitter to delete a product */
  public deleteProduct: OutputEmitterRef<Product> = output<Product>();
}
