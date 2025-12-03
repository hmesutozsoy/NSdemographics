# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Expo CLI for mobile development (`npm install -g expo-cli`)
- For smart contracts: Hardhat and a local blockchain (or use a testnet)

## Installation

1. Install dependencies for all workspaces:
```bash
npm install
npm run install:all
```

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create `.env` file:
```bash
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ns_demographics
NODE_ENV=development
```

3. Start MongoDB (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 mongo
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

## Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Create `.env` file (optional):
```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
```

3. Start Expo development server:
```bash
npm start
```

4. Install Expo Go app on your phone and scan the QR code, or use an emulator.

## Dashboard Setup

1. Navigate to dashboard directory:
```bash
cd dashboard
```

2. Create `.env.local` file (optional):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Start the development server:
```bash
npm run dev
```

The dashboard will run on `http://localhost:3000`

## Smart Contracts Setup

1. Navigate to contracts directory:
```bash
cd contracts
```

2. Install dependencies:
```bash
npm install
```

3. Compile contracts:
```bash
npm run compile
```

4. Deploy contracts (requires Semaphore contract address):
```bash
SEMAPHORE_ADDRESS=0x... npm run deploy
```

## Creating a Network School Group

Before users can submit proofs, you need to create a network school group:

```bash
curl -X POST http://localhost:3001/api/groups \
  -H "Content-Type: application/json" \
  -d '{
    "networkSchoolId": "school-001",
    "name": "Network School 001",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "radius": 1000
    }
  }'
```

## Usage Flow

1. **User creates Semaphore identity** (via mobile app)
2. **User submits location proof** with demographic data
3. **Backend verifies proof** and aggregates data
4. **Dashboard displays** aggregated demographics

## Notes

- Semaphore proof generation requires circuit files (`.wasm` and `.zkey`). For production, download these from the Semaphore protocol repository.
- GPS location verification uses Haversine formula to check if user is within the network school radius.
- All demographic data is encrypted in the Semaphore signal, ensuring privacy.

