import { Injectable } from '@nestjs/common';
import { IProductRepository } from './abstractions/product.repository';
import { Product } from './product.entity';
import { FindProducts } from './dtos/product-read.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Repository<Product>)
    private readonly repo: Repository<Product>,
  ) {}

  private getRepo(ctx?: EntityManager) {
    return ctx ? ctx.getRepository(Product) : this.repo;
  }

  async create(
    product: Partial<Product>,
    ctx?: EntityManager,
  ): Promise<string> {
    const newProduct = await this.getRepo(ctx).insert(product);
    return newProduct.identifiers[0].id;
  }

  async find(params: FindProducts): Promise<[Product[], number]> {
    const queryBuilder = this.repo.createQueryBuilder('product');

    if (params.name) {
      queryBuilder.andWhere('product.name %> :name', {
        name: `${params.name}`,
      });
    }

    queryBuilder.limit(params.limit);

    if (params.cursor) {
      queryBuilder.andWhere('product.id > :cursor', { cursor: params.cursor });
    }

    queryBuilder.orderBy('product.id', 'ASC');

    return await queryBuilder.getManyAndCount();
  }

  async update(product: Partial<Product>, tx?: EntityManager): Promise<void> {
    await this.getRepo(tx).update(product.id!, product);
  }

  async findById(id: string, tx?: EntityManager): Promise<Product | null> {
    return this.getRepo(tx).findOneBy({ id });
  }
}
