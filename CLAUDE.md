# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Noice Board (いいね掲示板) - A bulletin board system where users can evaluate posts by giving "likes" (evaluation points).

## Commands

### Development
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run preview` - Preview production build

### Testing
- `npm test` or `npm run test` - Run all tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface

### Code Quality
- `npm run lint` - Run ESLint

## Architecture

### Domain-Driven Design Structure

```
src/
├── domain/                 # Core business logic (functional approach)
│   ├── types/             # Common type definitions & branded types
│   ├── utils/             # Validators and helpers
│   ├── value-objects/     # Value objects (functional implementation)
│   ├── entities/          # Entities (interface + functions)
│   └── repositories/      # Repository interfaces
├── infrastructure/         # External integrations
│   ├── jira/             # Jira backend integration
│   ├── confluence/       # Confluence backend integration
│   └── NoiceBoardDataStoreApi.ts  # External datastore API interface
└── tests/                 # Test files mirroring src structure
```

### Key Architectural Decisions

1. **Functional Programming Approach**: Uses functions and interfaces instead of classes
   - Value objects: Exported functions (createX, getXValue, isXEqual)
   - Entities: Interface definitions with pure functions
   - Immutability enforced throughout

2. **Type Safety**: Extensive use of branded types and Result<T> pattern
   - All operations return `Result<T>` for safe error handling
   - Branded types prevent primitive obsession
   - Type guards for runtime validation

3. **External Backend Integration**: Supports Jira and Confluence as data stores
   - Implements `INoiceBoardDataStoreApi` interface
   - Repository pattern for data access

## Domain Model Key Concepts

### Core Entities
- **Post**: Board posts that can receive likes
- **User**: System users who create posts and give likes
- **PostGroup**: Hierarchical grouping of posts
- **Noice**: The "like" transaction between users

### Business Rules
- Users cannot like their own posts
- Like amounts must be positive integers
- Users cannot give more likes than they possess
- Only post creators can edit their posts

### Value Objects (Functional API)
- UserId, Username, PostId, PostTitle, PostContent
- NoiceAmount, RupeeAmount, NoiceLimit
- PostGroupPath, Hashtag, Comment, ReviewStatus

## Testing Approach

Tests are written using Vitest with the following patterns:
- Unit tests for all value objects and entities
- Integration tests for repository implementations
- Tests focus on valid inputs (type-safe approach)
- Invalid input handling is done at boundaries via Result<T> pattern

## Current Implementation Status

See `docs/implementation-progress.md` for detailed progress tracking. The project uses:
- React + TypeScript + Vite for frontend
- Functional programming patterns throughout
- Type-safe domain modeling
- Integration with external systems (Jira/Confluence)