import { TransactionCtx, TransactionOptions } from './transaction-ctx';

export const ITransactionManagerToken = Symbol('ITransactionManager');

export interface ITransactionManager {
  tx<T>(
    runInTx: (context: TransactionCtx) => Promise<T>,
    options?: TransactionOptions,
  ): Promise<T>;

  startTransaction(options?: TransactionOptions): Promise<TransactionCtx>;

  commitTransaction(ctx: TransactionCtx): Promise<void>;

  rollbackTransaction(ctx: TransactionCtx): Promise<void>;
}