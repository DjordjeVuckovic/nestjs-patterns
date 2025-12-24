import { Product } from '../product.entity';
import { type FindProducts } from '../dtos/product-read.dto';
import { TransactionCtx } from '../../store/transaction-ctx';

export const IProductRepositoryToken = Symbol('IProductRepository');

export type FindParams = FindProducts;

export interface IProductRepository {
  create(product: Partial<Product>, tx?: TransactionCtx): Promise<string>;
  update(product: Partial<Product>, tx?: TransactionCtx): Promise<void>;
  findById(id: string, tx?: TransactionCtx): Promise<Product | null>;
  find(params: FindParams): Promise<[Product[], number]>;
}
