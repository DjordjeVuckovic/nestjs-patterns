import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Category } from './category.entity';
import { TransactionCtx } from '../store/transaction-ctx';
import { ICategoryRepository } from './abstractions/category.repository';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  private getRepo(ctx?: EntityManager) {
    return ctx ? ctx.getRepository(Category) : this.repo;
  }
  async findByIds(ids: string[], ctx?: EntityManager): Promise<Category[]> {
    return this.getRepo(ctx)
      .findBy({ id: In(ids) });
  }
}