# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**いいね掲示板 (Noice Board)** - A React-based bulletin board system where users can give "noice" (like/rating points) to posts. Built with Domain-Driven Design (DDD) principles using functional programming patterns instead of traditional OOP.

## Development Commands

**Build & Development:**
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run preview` - Preview production build

**Testing:**
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI

**Code Quality:**
- `npm run lint` - Run ESLint (must be warning-free before commits)

## Architecture & Code Organization

**Domain-Driven Design (DDD) with Clean Architecture:**

```
src/domain/
├── types/index.ts          # Shared branded types and Result<T,E>
├── utils/validators.ts     # Type guards and validation functions
├── value-objects/         # Immutable value objects (functional implementation)
├── entities/              # Domain entities (interface + pure functions)
├── repositories/          # Repository interfaces
└── services/             # Domain services
```

**Key Architectural Principles:**
1. **Functional over OOP**: Use `interface` + pure functions instead of classes
2. **Branded Types**: Type-safe value objects (e.g., `UserId`, `PostTitle`)
3. **Result Pattern**: Safe error handling with `Result<T, E>` 
4. **Immutability**: All domain objects are readonly with pure update functions
5. **Type Safety**: Extensive validation with type guards

## Domain Model

**Core Entities:**
- **User**: System users who create posts and give noice
- **Post**: Bulletin posts that can receive noice ratings
- **PostGroup**: Collections of related posts
- **Noice**: Like/rating transactions between users

**Value Objects:**
- `UserId`, `Username` - User identification and naming
- `PostId`, `PostTitle`, `PostContent` - Post identification and content
- `NoiceAmount`, `RupeeAmount` - Quantity value objects

**Business Rules:**
- Users cannot give noice to their own posts
- Noice amounts must be positive integers
- Users cannot exceed their available noice balance
- Posts can only be edited by their creators

## Implementation Patterns

**Value Object Pattern:**
```typescript
// Interface definition
export interface UserId { readonly value: string }

// Factory functions
export const createUserId = (value: string): Result<UserId, string>
export const generateNewUserId = (): UserId

// Pure utility functions
export const getUserIdValue = (userId: UserId): string
export const isUserIdEqual = (userId1: UserId, userId2: UserId): boolean
```

**Entity Pattern:**
```typescript
// Interface definition
export interface User {
  readonly id: UserId
  readonly username: Username
  readonly rupeeAmount: RupeeAmount
  readonly createdAt: Date
}

// Factory and update functions
export const createUser = (params: CreateUserParams): Result<User, string>
export const updateUserRupeeAmount = (user: User, amount: RupeeAmount): User
```

## Code Style Guidelines

- **No Classes**: Use interfaces + functions instead of classes
- **Branded Types**: All domain identifiers use branded types for type safety
- **Pure Functions**: All operations are pure functions returning new objects
- **Result Type**: Use `Result<T, E>` for operations that can fail
- **Type Guards**: Validate all inputs with type guard functions
- **Immutability**: All domain objects are immutable (readonly properties)

## Testing Strategy

- **TDD Approach**: Write tests first, following t-wada's TDD practices
- **Domain Focus**: Test business logic and invariants thoroughly
- **Functional Testing**: Test pure functions with various inputs
- **No Invalid Input Tests**: Don't test type-guaranteed inputs with invalid values

## External Integrations

**Infrastructure Layer:**
- **Confluence Integration**: For external data storage
- **Jira Integration**: For issue tracking and workflow management

## Current Implementation Status

**✅ Completed:**
- Domain types and branded type system
- Value objects (functional implementation)
- Core entities (User, Post)
- Validation utilities and type guards

**🔄 In Progress:**
- Updating tests to match functional API
- Infrastructure layer implementations
- Application layer use cases

**Key Files to Reference:**
- `/docs/domain-model.md` - Complete domain specification in Japanese
- `/docs/implementation-progress.md` - Current implementation status
- `/src/domain/types/index.ts` - Core type definitions
- `/src/domain/utils/validators.ts` - Validation functions