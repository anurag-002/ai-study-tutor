# Overview

This is a full-stack AI-powered tutoring application built with React, Express, and PostgreSQL. The application provides an interactive chat interface where students can ask questions and receive detailed, step-by-step solutions. Users can upload images of problems (handwritten or printed) and get AI-generated explanations with proper mathematical formatting using LaTeX rendering.

The system is designed as a modern web application with a clean, responsive UI using shadcn/ui components and Tailwind CSS for styling. It features conversation management, file uploads, and real-time mathematical expression rendering to create an engaging learning experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Mathematical Rendering**: KaTeX for LaTeX math expression rendering
- **File Handling**: react-dropzone for drag-and-drop file uploads

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for conversations, messages, and file uploads
- **File Storage**: Local file system with multer for multipart form handling
- **Error Handling**: Centralized error middleware with status code management
- **Development**: Hot reload with Vite middleware integration

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Three main entities - users, conversations, and messages with proper foreign key relationships
- **Migrations**: Drizzle Kit for database schema migrations
- **Development Storage**: In-memory storage implementation for development/testing
- **Connection**: Neon Database serverless PostgreSQL hosting

## Authentication and Authorization
- **Current State**: Basic user identification system (demo user for development)
- **Session Management**: Prepared for PostgreSQL session storage using connect-pg-simple
- **Security**: Input validation using Zod schemas and file type restrictions for uploads

## External Service Integrations
- **AI Service**: Groq API for generating educational responses and problem-solving
- **Image Processing**: Support for JPEG, PNG, WebP, and PDF file uploads
- **Mathematical Rendering**: KaTeX CDN integration for client-side math rendering
- **Development Tools**: Replit integration for development environment

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database driver
- **drizzle-orm**: Type-safe SQL ORM with PostgreSQL dialect
- **express**: Web application framework for Node.js
- **react**: Frontend UI library with TypeScript support
- **vite**: Fast build tool and development server

## UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating component variants
- **lucide-react**: Icon library with React components

## AI and External Services
- **groq-sdk**: SDK for Groq AI language model integration
- **multer**: Middleware for handling multipart/form-data file uploads

## Development and Build Tools
- **tsx**: TypeScript execution environment for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit integration plugin

## Data Management
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management with validation
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: Schema validation library

## Utility Libraries
- **date-fns**: Modern date utility library
- **clsx**: Utility for constructing className strings
- **nanoid**: URL-safe unique string ID generator
- **wouter**: Lightweight router for React applications