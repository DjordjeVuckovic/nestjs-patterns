import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITransactionManagerToken } from './tx.manager';
import { TypeOrmTransactionManager } from './typeorm-tx.manager';
import { env } from '../env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      synchronize: false, // generate schema on the fly
      migrationsRun: true, // auto run migrations on app launch
      logging: env.DB_LOGGING,
    }),
  ],
  providers: [
    {
      provide: ITransactionManagerToken,
      useClass: TypeOrmTransactionManager,
    },
  ],
  exports: [TypeOrmModule, ITransactionManagerToken],
})
export class StoreModule {}
