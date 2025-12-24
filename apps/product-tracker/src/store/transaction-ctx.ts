import { EntityManager } from 'typeorm';

export type TransactionCtx = EntityManager;
export type TransactionOptions = {
  isolationLevel?: 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';
};