# Project Baseline - Before Dependency Updates

**Date**: December 8, 2025
**Branch**: feature/dependency-update-vercel
**Purpose**: Document current state before updating dependencies for Vercel deployment

## Current Environment

- **Node.js**: >=12.18.3
- **npm**: >=6.14.6

## API Backend Dependencies (Current State)

### Production Dependencies

- axios: ^0.27.2
- body-parser: ^1.19.0
- cookie-parser: ^1.4.5
- cors: ^2.8.5
- dotenv: ^8.2.0
- express: ^4.17.1
- express-joi-validation: ^5.0.1
- joi: ^17.6.0
- morgan: ^1.10.0
- nodemon: ^2.0.19
- pg: ^8.5.1
- sequelize: ^6.3.5

### Dev Dependencies

- chai: ^4.2.0
- mocha: ^8.2.1
- supertest: ^6.0.1
- supertest-session: ^4.1.0

## Frontend Client Dependencies (Current State)

### Production Dependencies

- @reduxjs/toolkit: ^1.8.1
- @testing-library/jest-dom: ^5.11.6
- @testing-library/react: ^11.2.1
- @testing-library/user-event: ^12.2.2
- axios: ^0.27.2
- dotenv: ^16.0.1
- react: ^17.0.1
- react-dom: ^17.0.1
- react-icons: ^4.4.0
- react-redux: ^8.0.1
- react-router-dom: ^6.3.0
- react-scripts: 4.0.0
- redux: ^4.2.0
- redux-devtools-extension: ^2.13.9
- redux-thunk: ^2.4.1
- styled-components: ^5.2.3
- sweetalert2: ^11.4.6
- web-vitals: ^0.2.4

## Current Scripts

### API Scripts

- start: `nodemon -L`
- test: `mocha -w ./tests/**/*.spec.js`

### Frontend Scripts

- start: `react-scripts start`
- build: `react-scripts build`
- test: `react-scripts test`
- eject: `react-scripts eject`

## Known Issues/Notes

- API uses nodemon for development (should be moved to devDependencies)
- Frontend uses React 17 (needs migration to React 18 createRoot API)
- No Vercel configuration files present
- No environment variable documentation (.env.example files)

## Test Baseline

See TEST_BASELINE.md for detailed test results before updates.
