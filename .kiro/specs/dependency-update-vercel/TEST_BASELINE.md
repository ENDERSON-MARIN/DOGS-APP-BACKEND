# Test Baseline - Before Dependency Updates

**Date**: December 8, 2025
**Branch**: feature/dependency-update-vercel

## Current Test Status

### API Backend Tests

**Location**: `api/tests/`

**Test Files**:

1. `api/tests/models/dog.spec.js` - Dog model validators
2. `api/tests/routes/dog.spec.js` - Dog API routes

**Test Framework**: Mocha + Chai + Supertest

**Test Command**: `npm test` (runs `mocha -w ./tests/**/*.spec.js`)

**Dependencies Status**:

- ⚠️ Dependencies NOT installed (no node_modules folder)
- Cannot run tests until dependencies are installed

**Test Coverage**:

#### Dog Model Tests (`dog.spec.js`)

- Validates `name` field (required)
- Validates `height_min` field (required)
- Validates `height_max` field (required)
- Validates `weight_min` field (required)
- Validates `weight_max` field (required)

#### Dog Routes Tests (`dog.spec.js`)

- GET /dogs endpoint (expects 200 status)

### Frontend Client Tests

**Location**: `client/src/`

**Test Framework**: Jest + React Testing Library (via react-scripts)

**Test Command**: `npm test` (runs `react-scripts test`)

**Dependencies Status**:

- ⚠️ Dependencies NOT installed (no node_modules folder)
- Cannot run tests until dependencies are installed

**Test Files**:

- `client/src/App.test.js` (default CRA test)

## Pre-Update Notes

1. **Dependencies Not Installed**: Both API and frontend need `npm install` before tests can run
2. **Database Required**: API tests require PostgreSQL database connection
3. **Environment Variables**: Tests may require .env configuration
4. **Test Mode**: API tests run in watch mode by default (`mocha -w`)

## Baseline Execution Plan

Since dependencies are not installed, the baseline test execution will be:

1. Install API dependencies: `cd api && npm install`
2. Install frontend dependencies: `cd client && npm install`
3. Configure database connection (if needed)
4. Run API tests: `cd api && npm test` (non-watch mode)
5. Run frontend tests: `cd client && npm test -- --watchAll=false`

## Expected Test Results

Based on the test files, we expect:

- **API**: 10 tests (5 model validators + 1 route test, each with positive/negative cases)
- **Frontend**: 1 test (default App test)

## Post-Update Validation

After dependency updates, we will:

1. Re-run all tests
2. Compare results with this baseline
3. Fix any breaking changes
4. Document any test modifications needed
