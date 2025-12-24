# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo demonstrating NestJS design patterns and best practices, with a focus on implementing the **Outbox Pattern** and **Unit of Work (UoW) Pattern**. The repository uses pnpm workspaces to manage multiple applications.

**Current state**: The `product-tracker` application is set up with basic infrastructure. The next step is to implement the **outbox library**.

## Workspace Structure

- **Root**: Workspace manager with pnpm
- **`apps/product-tracker/`**: Main NestJS application demonstrating patterns

## Common Commands

### From Root Directory
```bash
# Install all dependencies
pnpm install

# Start product-tracker application
pnpm run start:product-tracker
```

### From `apps/product-tracker/` Directory
```bash
# Development
pnpm run start:dev          # Start with hot-reload
pnpm run start:debug        # Start in debug mode

# Building
pnpm run build              # Build the application

# Testing
pnpm run test               # Run unit tests
pnpm run test:watch         # Run tests in watch mode
pnpm run test:cov           # Run tests with coverage
pnpm run test:e2e           # Run end-to-end tests
pnpm run test:debug         # Debug a single test

# Code Quality
pnpm run lint               # Run ESLint with auto-fix
pnpm run format             # Format code with Prettier

# Database Migrations
pnpm run migration:generate src/migrations/MigrationName  # Generate migration from entities
pnpm run migration:create src/migrations/MigrationName    # Create empty migration
pnpm run migration:run      # Run pending migrations
pnpm run migration:revert   # Revert the last migration
pnpm run migration:show     # Show migration status
```

## Environment Configuration

The application uses **Zod** for type-safe environment variable validation (`src/env.ts`):

- **Configuration file**: `apps/product-tracker/src/env.ts`
- **Validation**: Environment variables are validated on startup using Zod schemas
- **Type safety**: Access environment variables via the typed `env` object (e.g., `env.DB_HOST`)
- **Default values**: Development defaults are provided in the schema

### Environment Variables

Create a `.env` file in `apps/product-tracker/` with:

```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5440              # PostgreSQL port (default: 5432)
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=product_tracker
DB_LOGGING=false          # Enable TypeORM query logging
```

## Database Migrations

The application uses **TypeORM migrations** for database schema management:

### Migration Files

- **Location**: `apps/product-tracker/src/migrations/`
- **Data Source**: `apps/product-tracker/src/data-source.ts` - TypeORM configuration for migrations
- **Naming**: Migrations are prefixed with timestamps (e.g., `1735053000000-EnableUuidExtension.ts`)

### Initial Setup

1. **UUID Extension**: `1735053000000-EnableUuidExtension.ts` - Enables `uuid-ossp` extension
2. **Initial Schema**: `1766589494875-InitialSchema.ts` - Creates `products` and `categories` tables

### Migration Workflow

```bash
# 1. Make changes to entity files (*.entity.ts)
# 2. Generate a migration from entity changes
pnpm run migration:generate src/migrations/DescriptiveName

# 3. Review the generated migration file
# 4. Run the migration
pnpm run migration:run

# If needed, revert the last migration
pnpm run migration:revert
```

### Important Notes

- **Never use `synchronize: true` in production** - Migrations are the source of truth
- **Review generated migrations** - TypeORM may not always generate optimal SQL
- **Custom migrations** - Use `migration:create` for data migrations or complex schema changes
- **Migration order** - Migrations run in timestamp order (oldest first)

## Architecture & Key Patterns

### 1. Repository Pattern with Abstraction

The codebase uses an **interface-based repository pattern** to decouple data access from business logic:

- **Abstractions** are defined in `*/abstractions/*.repository.ts` files using TypeScript interfaces
- **Symbol tokens** (e.g., `IProductRepositoryToken`) are exported for dependency injection
- **Concrete implementations** are in `*.repository.ts` files
- **DI Configuration** in `*.module.ts` binds interfaces to implementations:
  ```typescript
  {
    provide: IProductRepositoryToken,
    useClass: ProductRepository
  }
  ```

Example: `products/abstractions/product.repository.ts` defines `IProductRepository`, implemented by `products/product.repository.ts`.

### 2. Transaction Management Abstraction

The `store/` module provides a **database-agnostic transaction management** system:

- **`ITransactionManager`** (`store/tx.manager.ts`): Interface for transaction operations
- **`TypeOrmTransactionManager`** (`store/typeorm-tx.manager.ts`): TypeORM-specific implementation
- **`TransactionCtx`** (`store/transaction-ctx.ts`): Type alias for `EntityManager` (currently TypeORM-specific)

**Usage pattern**: Services inject `ITransactionManager` and use the `tx()` method:
```typescript
await this.txManager.tx(async (tx) => {
  await this.repository.create(entity, tx);
  // Multiple operations in same transaction
});
```

All repository methods accept an optional `TransactionCtx` parameter to participate in transactions.

### 3. TypeORM Entity Pattern

Entities follow these conventions:
- Located in `*.entity.ts` files
- Use TypeORM decorators (`@Entity`, `@Column`, etc.)
- **Constructor pattern**: Entities have constructors accepting `Partial<Entity>` for object creation
- **Soft deletes**: Use `@DeleteDateColumn` for `deletedAt` fields
- **UUID primary keys**: Default to `uuid_generate_v4()`
- **Timestamps**: `@CreateDateColumn` for `createdAt`

### 4. DTO Pattern with Zod

- **Write DTOs** (`dtos/*-write.dto.ts`): For creating/updating resources
- **Read DTOs** (`dtos/*-read.dto.ts`): For querying and reading resources
- Uses `nestjs-zod` for validation (Zod v4.x)
- Type exports for both the Zod schema and inferred TypeScript type

### 5. Cursor-Based Pagination

The `shared/types/cursor-pagination.ts` module provides cursor-based pagination:
- **`CursorResponse<T>`**: Standard response format with `data`, `nextCursor`, and `total`
- **`createCursorResponse()`**: Helper function to create cursor responses
- Used in repository `find()` methods and service layer

### 6. Module Structure

Each feature follows this structure:
```
feature/
├── abstractions/
│   └── feature.repository.ts    # Interface + token
├── dtos/
│   ├── feature-read.dto.ts      # Query/response DTOs
│   └── feature-write.dto.ts     # Create/update DTOs
├── feature.entity.ts            # TypeORM entity
├── feature.repository.ts        # Repository implementation
├── feature.service.ts           # Business logic
├── feature.controller.ts        # HTTP endpoints
├── feature.service.spec.ts      # Unit tests
└── feature.module.ts            # NestJS module
```

### 7. Shared Infrastructure

- **`shared/filters/http-exception.filter.ts`**: Global exception filter (registered in `main.ts`)
- **`shared/types/`**: Shared type definitions (e.g., cursor pagination)
- **`store/`**: Database and transaction management infrastructure

## Technology Stack

- **Framework**: NestJS 11.x
- **ORM**: TypeORM 0.3.x
- **Database**: PostgreSQL (via `pg` driver)
- **Validation**: Zod 4.x with `nestjs-zod`
- **Testing**: Jest 30.x with `ts-jest`
- **Language**: TypeScript 5.7.x with ES2023 target
- **Module System**: Node.js ESM (nodenext)

## Next Steps: Outbox Library Implementation

The next major task is implementing an **outbox pattern library** to ensure reliable event publishing in distributed systems. This will likely involve:

1. Creating a new `libs/outbox/` or similar package
2. Implementing outbox table schema and entity
3. Building outbox message persistence and polling mechanisms
4. Integrating with the existing transaction management system
5. Providing a clean API for publishing domain events

## Development Notes

- **Dependency Injection**: Always use constructor injection with interface tokens
- **Transaction Context**: Pass `TransactionCtx` through repository methods when operations must be atomic
- **Error Handling**: Services use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`, etc.)
- **Logging**: Services use `Logger` from `@nestjs/common` with structured log messages
- **Testing**: Unit tests use `*.spec.ts` suffix, e2e tests use `*.e2e-spec.ts` suffix