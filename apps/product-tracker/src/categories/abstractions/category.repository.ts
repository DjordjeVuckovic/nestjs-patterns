import { TransactionCtx } from '../../store/transaction-ctx';
import { Category } from '../category.entity';

export const ICategoryRepositoryToken = Symbol('ICategoryRepository');

export interface ICategoryRepository {
  findByIds(ids: string[], ctx?: TransactionCtx): Promise<Category[]>;
}