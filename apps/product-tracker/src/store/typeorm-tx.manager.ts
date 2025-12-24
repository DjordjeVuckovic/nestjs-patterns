import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ITransactionManager } from './tx.manager';
import { TransactionCtx, TransactionOptions } from './transaction-ctx';

@Injectable()
export class TypeOrmTransactionManager implements ITransactionManager {
  private readonly logger = new Logger(TypeOrmTransactionManager.name);
  constructor(private dataSource: DataSource) {}

  async tx<T>(
    run: (manager: EntityManager) => Promise<T>,
    options?: TransactionOptions,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(
      this.toIsolationLevel(options?.isolationLevel),
    );

    try {
      const result = await run(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      this.logger.error('Transaction failed, rolling back.', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async startTransaction(): Promise<TransactionCtx> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return Promise.resolve(queryRunner.manager);
  }

  commitTransaction(ctx: TransactionCtx): Promise<void> {
    return ctx.connection.createQueryRunner().commitTransaction();
  }

  rollbackTransaction(ctx: TransactionCtx): Promise<void> {
    return ctx.connection.createQueryRunner().rollbackTransaction();
  }

  private toIsolationLevel(level?: TransactionOptions['isolationLevel']) {
    switch (level) {
      case 'READ UNCOMMITTED':
        return 'READ UNCOMMITTED';
      case 'READ COMMITTED':
        return 'READ COMMITTED';
      case 'REPEATABLE READ':
        return 'REPEATABLE READ';
      case 'SERIALIZABLE':
        return 'SERIALIZABLE';
      default:
        return undefined;
    }
  }
}
