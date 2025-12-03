# Architecture Overview

## System Components

### 1. Mobile App (React Native + Expo)
- **Purpose**: User-facing application for creating identities and submitting proofs
- **Key Features**:
  - Semaphore identity creation and storage
  - GPS location capture
  - Demographic data input
  - Proof generation and submission
  - Dashboard viewing

### 2. Backend API (Node.js + Express + MongoDB)
- **Purpose**: Proof verification and data aggregation
- **Key Features**:
  - Proof verification (location, nullifier, merkle root)
  - Group management (Semaphore groups per network school)
  - Demographic data aggregation
  - Privacy-preserving data storage

### 3. Dashboard (Next.js + React)
- **Purpose**: Visualize aggregated demographic data
- **Key Features**:
  - Real-time demographic statistics
  - Age and gender distribution charts
  - Location distribution visualization
  - Filter by network school

### 4. Smart Contracts (Solidity + Hardhat)
- **Purpose**: On-chain verification and immutability
- **Key Features**:
  - Semaphore proof verification on-chain
  - Nullifier tracking (prevents double-spending)
  - Member count tracking
  - Group management

## Data Flow

```
User (Mobile App)
  ↓
1. Create Semaphore Identity
  ↓
2. Get GPS Location
  ↓
3. Input Demographics
  ↓
4. Generate Proof (Semaphore ZK proof)
  ↓
5. Submit to Backend API
  ↓
Backend API
  ↓
6. Verify Proof (location, nullifier, merkle root)
  ↓
7. Store Proof (MongoDB)
  ↓
8. Aggregate Demographics
  ↓
Dashboard
  ↓
9. Display Aggregated Data
```

## Privacy Features

1. **Semaphore Protocol**: Zero-knowledge proofs ensure users can prove membership without revealing identity
2. **Encrypted Signals**: Demographic data is encrypted in the Semaphore signal
3. **Nullifier Tracking**: Prevents double-spending while maintaining anonymity
4. **No Personal Data Storage**: Only aggregated statistics are stored

## Security Considerations

1. **Proof Verification**: Backend verifies all proofs before accepting them
2. **Location Validation**: Ensures users are within network school radius
3. **Nullifier Reuse Prevention**: Tracks used nullifiers to prevent proof replay
4. **Merkle Root Validation**: Ensures proof is valid for current group state

## Network School Concept

A Network School is a virtual/physical location where members can prove their presence:
- Defined by a center point (latitude/longitude) and radius
- Has an associated Semaphore group
- Members can submit proofs when within the radius
- Demographics are aggregated per network school

## Future Enhancements

1. **Full ZK Proof Verification**: Integrate complete Semaphore circuit files
2. **On-chain Verification**: Deploy and use smart contracts for verification
3. **Map Integration**: Add interactive maps showing location distributions
4. **Real-time Updates**: WebSocket support for live dashboard updates
5. **Multi-chain Support**: Support for multiple blockchain networks
6. **Advanced Analytics**: More detailed demographic breakdowns

