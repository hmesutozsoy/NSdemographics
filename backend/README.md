# NS Demographics Backend API

Node.js/Express backend for verifying Semaphore proofs and aggregating demographic data.

## API Endpoints

### Proofs
- `POST /api/proofs` - Submit a location proof
- `GET /api/proofs/school/:networkSchoolId` - Get proofs for a network school

### Groups
- `GET /api/groups` - List all groups
- `GET /api/groups/:networkSchoolId` - Get group info
- `POST /api/groups` - Create a new group

### Demographics
- `GET /api/demographics` - Get aggregated demographics (all schools)
- `GET /api/demographics/:networkSchoolId` - Get aggregated demographics for a school

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB and create `.env` file

3. Start server:
```bash
npm run dev
```

## Database Models

- **Proof**: Stores verified location proofs with demographic data
- **Group**: Stores Semaphore group information for each network school

## Proof Verification

The backend verifies:
1. Semaphore proof validity
2. Location is within network school radius
3. Nullifier hasn't been used before (prevents double-spending)

