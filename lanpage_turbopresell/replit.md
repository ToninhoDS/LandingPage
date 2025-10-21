# Super Presell - Landing Page Application

## Overview

This is a full-stack web application for "Super Presell", a Portuguese-language marketing tool that helps create pre-sell landing pages for affiliate marketers. The application is built with a modern tech stack featuring React frontend, Express backend, and PostgreSQL database with Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom conversion-focused color palette
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for smooth transitions and interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store with connect-pg-simple
- **Development**: Hot module replacement with Vite middleware integration

### Design Philosophy
- **Conversion-Focused**: Custom CSS variables and components optimized for marketing funnels
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Performance**: Optimized for PageSpeed with lazy loading and efficient bundling
- **Accessibility**: Radix UI components ensure WCAG compliance

## Key Components

### Frontend Components
1. **Landing Page Sections**:
   - Hero section with conversion-focused messaging
   - Features showcase with animations
   - Advanced features highlighting "presell fantasma" technology
   - Statistics counter with animated numbers
   - Customer testimonials with star ratings
   - Pricing tiers with call-to-action buttons
   - Contact form with validation
   - Footer with social links

2. **UI Components**:
   - Comprehensive shadcn/ui component library
   - Custom animations using Framer Motion
   - Responsive navigation with mobile menu
   - Toast notifications for user feedback

### Backend Components
1. **Server Structure**:
   - Express.js application with TypeScript
   - Route registration system
   - Error handling middleware
   - Request logging with performance metrics

2. **Storage Layer**:
   - Abstract storage interface for CRUD operations
   - In-memory storage implementation for development
   - User management with username/password authentication
   - Prepared for PostgreSQL integration

### Database Schema
- **Users Table**: Basic user management with id, username, and password fields
- **Drizzle Integration**: Type-safe database operations with Zod schema validation
- **Migration System**: Drizzle Kit for database schema management

## Data Flow

1. **Client Requests**: Frontend makes API requests through TanStack Query
2. **Server Processing**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM provides type-safe database interactions
4. **Response Handling**: JSON responses with proper error handling and logging
5. **State Management**: TanStack Query caches and manages server state on the client

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, Radix UI, Tailwind CSS
- **State Management**: TanStack Query
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Utilities**: date-fns, clsx, class-variance-authority

### Backend Dependencies
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Session Management**: connect-pg-simple
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety across the stack
- **Linting**: ESLint configuration
- **CSS Processing**: PostCSS with Tailwind and Autoprefixer

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with auto-restart on changes
- **Database**: Development uses in-memory storage, production ready for PostgreSQL

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command
- **Environment**: Production mode with proper error handling and logging

### Database Configuration
- **Connection**: PostgreSQL via DATABASE_URL environment variable
- **ORM**: Drizzle with PostgreSQL dialect
- **Migrations**: Stored in `./migrations` directory
- **Schema**: Shared between frontend and backend in `shared/schema.ts`

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```