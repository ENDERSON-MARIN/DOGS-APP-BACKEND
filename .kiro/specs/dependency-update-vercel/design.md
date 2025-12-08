# Design Document - Dependency Update for Vercel Deployment

## Overview

Este documento descreve o design para atualizar as dependências do projeto Dogs API (backend e frontend) para versões modernas compatíveis com deploy na Vercel. A atualização envolve migração de React 17 para React 18, atualização de Express e Sequelize, modernização do Redux Toolkit, e configuração específica para ambiente serverless da Vercel.

O projeto atual usa:

- **API**: Node.js 12+, Express 4.17.1, Sequelize 6.3.5, PostgreSQL
- **Frontend**: React 17, Redux Toolkit 1.8.1, React Router 6.3.0, react-scripts 4.0.0

Após a atualização, o projeto usará:

- **API**: Node.js 18+ (LTS), Express 4.19+, Sequelize 6.35+
- **Frontend**: React 18.3+, Redux Toolkit 2.2+, React Router 6.22+, react-scripts 5.0+

## Architecture

### Current Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   React 17      │         │   Express API   │
│   Frontend      │────────▶│   Node 12+      │
│   Port 3000     │  HTTP   │   Port 3001     │
└─────────────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   PostgreSQL    │
                            │   Database      │
                            └─────────────────┘
```

### Target Architecture (Vercel)

```
┌─────────────────────────────────────────────┐
│              Vercel Platform                │
│                                             │
│  ┌──────────────────┐  ┌─────────────────┐ │
│  │  Static Frontend │  │ API Serverless  │ │
│  │  React 18 (CDN)  │  │   Functions     │ │
│  └──────────────────┘  └─────────────────┘ │
│           │                     │           │
└───────────┼─────────────────────┼───────────┘
            │                     │
            └─────────┬───────────┘
                      ▼
            ┌─────────────────┐
            │   PostgreSQL    │
            │  (External DB)  │
            └─────────────────┘
```

## Components and Interfaces

### 1. API Backend Components

#### 1.1 Package.json Updates

- **Node.js Engine**: Atualizar para 18.x (LTS atual)
- **Express**: 4.17.1 → 4.19.2 (últimas correções de segurança)
- **Sequelize**: 6.3.5 → 6.35.2 (suporte melhorado para PostgreSQL)
- **pg**: 8.5.1 → 8.11.5 (driver PostgreSQL atualizado)
- **axios**: 0.27.2 → 1.6.7 (breaking changes na API)
- **cors**: 2.8.5 → 2.8.5 (mantém, está atualizado)
- **dotenv**: 8.2.0 → 16.4.5 (suporte melhorado)
- **morgan**: 1.10.0 → 1.10.0 (mantém)
- **nodemon**: 2.0.19 → 3.1.0 (dev dependency)

#### 1.2 Vercel Serverless Configuration

```javascript
// api/vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

#### 1.3 Environment Variables

- `DATABASE_URL`: Connection string para PostgreSQL
- `NODE_ENV`: production/development
- `PORT`: Porta da aplicação (Vercel gerencia automaticamente)
- `CORS_ORIGIN`: URL do frontend para CORS

### 2. Frontend Client Components

#### 2.1 Package.json Updates

- **React**: 17.0.1 → 18.3.1 (nova API de renderização)
- **React-DOM**: 17.0.1 → 18.3.1
- **React Router**: 6.3.0 → 6.22.3 (melhorias de performance)
- **Redux Toolkit**: 1.8.1 → 2.2.1 (TypeScript melhorado)
- **React Redux**: 8.0.1 → 9.1.0 (compatível com React 18)
- **react-scripts**: 4.0.0 → 5.0.1 (Webpack 5, suporte React 18)
- **axios**: 0.27.2 → 1.6.7
- **styled-components**: 5.2.3 → 6.1.8 (performance melhorada)
- **Testing Library**: Atualizar para versões compatíveis com React 18

#### 2.2 React 18 Migration Changes

```javascript
// Antes (React 17)
import ReactDOM from "react-dom";
ReactDOM.render(<App />, document.getElementById("root"));

// Depois (React 18)
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

#### 2.3 Vercel Configuration

```json
// client/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-api-domain.vercel.app/api/:path*"
    }
  ]
}
```

### 3. Build and Deployment Scripts

#### 3.1 API Scripts

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "echo 'No build step required'",
    "vercel-build": "echo 'Installing dependencies' && npm install"
  }
}
```

#### 3.2 Frontend Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## Data Models

### Dependency Version Matrix

| Package           | Current | Target | Breaking Changes      |
| ----------------- | ------- | ------ | --------------------- |
| **API Backend**   |
| Node.js           | 12+     | 18.x   | Sim - APIs deprecadas |
| Express           | 4.17.1  | 4.19.2 | Não                   |
| Sequelize         | 6.3.5   | 6.35.2 | Não                   |
| pg                | 8.5.1   | 8.11.5 | Não                   |
| axios             | 0.27.2  | 1.6.7  | Sim - API changes     |
| nodemon           | 2.0.19  | 3.1.0  | Não                   |
| **Frontend**      |
| React             | 17.0.1  | 18.3.1 | Sim - render API      |
| React-DOM         | 17.0.1  | 18.3.1 | Sim - render API      |
| React Router      | 6.3.0   | 6.22.3 | Não                   |
| Redux Toolkit     | 1.8.1   | 2.2.1  | Sim - TypeScript      |
| React Redux       | 8.0.1   | 9.1.0  | Não                   |
| react-scripts     | 4.0.0   | 5.0.1  | Sim - Webpack 5       |
| styled-components | 5.2.3   | 6.1.8  | Sim - API changes     |

### Environment Configuration Model

```typescript
// API Environment Variables
interface APIEnvironment {
  DATABASE_URL: string;
  NODE_ENV: "development" | "production" | "test";
  PORT?: number;
  CORS_ORIGIN: string;
}

// Frontend Environment Variables
interface FrontendEnvironment {
  REACT_APP_API_URL: string;
  REACT_APP_ENV: "development" | "production";
}
```

##

Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

Since this is a dependency update and configuration task rather than algorithmic implementation, most validation will be done through examples and verification steps rather than universal properties. The correctness is verified by checking specific configuration files and running validation commands.

### Configuration Validation Examples

Example 1: Node.js version specification
_For the_ API package.json, the engines.node field should specify ">=18.0.0"
**Validates: Requirements 1.1**

Example 2: React 18 migration
_For the_ frontend index.js, the code should use createRoot from 'react-dom/client' instead of ReactDOM.render
**Validates: Requirements 4.2**

Example 3: Vercel configuration files
_For both_ API and frontend directories, vercel.json files should exist with proper configuration
**Validates: Requirements 7.1**

Example 4: Package versions
_For the_ API package.json, Express version should be "^4.18.0" or higher
**Validates: Requirements 1.2**

Example 5: Build scripts
_For the_ frontend package.json, a "build" script should exist that runs "react-scripts build"
**Validates: Requirements 3.2**

Example 6: Environment documentation
_For both_ API and frontend, .env.example files should exist documenting required variables
**Validates: Requirements 7.3**

Example 7: No security vulnerabilities
_For both_ projects, running npm audit should report 0 high or critical vulnerabilities
**Validates: Requirements 1.4**

Example 8: Successful builds
_For both_ projects, running npm run build should complete without errors
**Validates: Requirements 8.5**

## Error Handling

### 1. Dependency Installation Errors

**Scenario**: npm install fails due to version conflicts

- **Detection**: Monitor npm install exit code and stderr
- **Resolution**:
  - Check for peer dependency conflicts
  - Use `npm install --legacy-peer-deps` if needed for React 18 migration
  - Update conflicting packages to compatible versions
  - Document any required flags in README

### 2. Breaking Changes in Dependencies

**Scenario**: Updated dependencies introduce breaking API changes

- **Detection**: Runtime errors, TypeScript errors, test failures
- **Resolution**:
  - **axios 1.x**: Update error handling to use `error.response` instead of direct error properties
  - **React 18**: Replace ReactDOM.render with createRoot
  - **styled-components 6**: Update theme provider if used
  - **Redux Toolkit 2**: Update TypeScript types if using TypeScript
  - Document all breaking changes in CHANGELOG.md

### 3. Vercel Deployment Failures

**Scenario**: Application fails to deploy or run on Vercel

- **Detection**: Vercel build logs, runtime errors
- **Resolution**:
  - Verify vercel.json configuration
  - Check environment variables are set in Vercel dashboard
  - Ensure Node.js version matches in package.json engines
  - Verify serverless function size limits (50MB)
  - Check database connection from Vercel environment

### 4. Database Connection Issues

**Scenario**: Sequelize fails to connect to PostgreSQL on Vercel

- **Detection**: Connection timeout errors, authentication failures
- **Resolution**:
  - Use DATABASE_URL environment variable
  - Configure SSL for production database connections
  - Add connection pooling configuration for serverless
  - Set appropriate connection timeouts
  ```javascript
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
  ```

### 5. CORS Configuration Issues

**Scenario**: Frontend cannot communicate with API due to CORS

- **Detection**: Browser console CORS errors
- **Resolution**:
  - Update CORS_ORIGIN environment variable
  - Configure CORS middleware with Vercel URLs
  - Add proper headers in vercel.json
  ```javascript
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    })
  );
  ```

### 6. Build Size Warnings

**Scenario**: Frontend build exceeds recommended size limits

- **Detection**: react-scripts build warnings
- **Resolution**:
  - Implement code splitting with React.lazy
  - Optimize images and assets
  - Remove unused dependencies
  - Use production builds only

### 7. Test Configuration Failures

**Scenario**: Tests fail after React 18 update

- **Detection**: Test runner errors, assertion failures
- **Resolution**:
  - Update @testing-library/react to v13+
  - Wrap async operations in `act()`
  - Update test setup for React 18 rendering
  - Use `waitFor` for async assertions

## Testing Strategy

### Unit Testing Approach

Since this is primarily a configuration and dependency update task, traditional unit tests are less applicable. Instead, we focus on:

1. **Configuration Validation Tests**

   - Verify package.json structure and versions
   - Check vercel.json syntax and configuration
   - Validate environment variable documentation

2. **Integration Smoke Tests**

   - Test that API endpoints respond correctly
   - Verify frontend renders without errors
   - Check database connectivity

3. **Build Validation**
   - Ensure both projects build successfully
   - Verify no console errors in development mode
   - Check production builds complete

### Property-Based Testing Approach

For this dependency update project, property-based testing is not applicable as we are not implementing algorithmic logic. Instead, we use:

1. **Validation Scripts**

   - Scripts to verify package versions
   - Scripts to check configuration files
   - Scripts to run security audits

2. **Manual Verification Checklist**
   - Visual inspection of running applications
   - Testing key user flows
   - Verifying deployment on Vercel

### Testing Framework

- **API**: Mocha + Chai + Supertest (existing)
- **Frontend**: Jest + React Testing Library (via react-scripts)
- **Validation**: Custom Node.js scripts for configuration checks

### Test Execution Strategy

1. **Pre-Update Baseline**

   - Run existing tests to establish baseline
   - Document current functionality
   - Take note of any existing failures

2. **Post-Update Validation**

   - Run all existing tests
   - Execute new validation scripts
   - Perform manual smoke testing
   - Run npm audit for security

3. **Deployment Validation**
   - Test on Vercel preview deployment
   - Verify all environment variables
   - Test production build
   - Monitor for runtime errors

### Validation Commands

```bash
# API Validation
cd api
npm install
npm audit
npm start # Verify starts without errors

# Frontend Validation
cd client
npm install
npm audit
npm run build # Verify builds successfully
npm start # Verify runs without errors

# Security Check
npm audit --audit-level=high

# Vercel Deployment Test
vercel --prod
```

## Migration Path

### Phase 1: API Backend Update

1. Update package.json with new versions
2. Run npm install
3. Fix any breaking changes
4. Test API endpoints
5. Create vercel.json
6. Document environment variables

### Phase 2: Frontend Update

1. Update package.json with new versions
2. Run npm install with --legacy-peer-deps if needed
3. Update React 18 render API
4. Fix styled-components breaking changes
5. Test application functionality
6. Create vercel.json
7. Update environment configuration

### Phase 3: Documentation

1. Create CHANGELOG.md
2. Update README.md
3. Create .env.example files
4. Document deployment process

### Phase 4: Deployment

1. Test local builds
2. Deploy to Vercel preview
3. Verify functionality
4. Deploy to production
5. Monitor for errors

## Rollback Strategy

If critical issues arise:

1. Revert package.json changes
2. Run npm install to restore old versions
3. Remove vercel.json files if they cause issues
4. Restore original code (React 17 render API)
5. Document issues for future attempts

## Performance Considerations

- React 18 automatic batching improves render performance
- Webpack 5 (via react-scripts 5) provides better tree-shaking
- Vercel CDN provides faster static asset delivery
- Serverless functions have cold start considerations
- Database connection pooling important for serverless

## Security Considerations

- All dependencies updated to versions without known vulnerabilities
- npm audit should report 0 high/critical issues
- Environment variables properly secured in Vercel
- Database connections use SSL in production
- CORS properly configured to prevent unauthorized access
