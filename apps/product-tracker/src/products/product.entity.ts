import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products', { schema: 'public' })
export class Product {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('text', { name: 'name' })
  name: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('numeric', { name: 'price', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date | null;

  @ManyToMany(() => Category, (category) => category.id)
  categories: Category[];

  constructor(partial: Partial<Product>, categories?: Category[]) {
    Object.assign(this, partial);
    if (categories) {
      this.categories = categories;
    }
  }
}
