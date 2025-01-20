import {Product} from '../models/product.model';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Test Product 1',
    description: 'Test Description 1',
    department: 'Test Department 1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Test Description 2',
    department: 'Test Department 2',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
