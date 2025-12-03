# NS Demographics

Privacy-preserving demographic tracking system for Network States using Semaphore protocol and GPS location verification.

## Overview

Network States require transparent, auditable community data to demonstrate their legitimacy, coordinate resources, and make collective decisions. However, traditional demographic tracking creates privacy vulnerabilities and centralization risks that conflict with crypto native values.

This solution enables Network States to:
1. Verify demographic distributions without revealing individual identities
2. Provide auditable proof of community makeup to potential members, partners, and governance participants
3. Keep sensitive personal data private while still enabling the collective intelligence needed for coordination

## Architecture

- **Mobile App**: React Native app for creating Semaphore identity, GPS location verification, and proof generation
- **Backend API**: Node.js/Express API for proof verification and demographic data aggregation
- **Dashboard**: Web dashboard for displaying aggregated demographic statistics
- **Smart Contracts**: Solidity contracts for on-chain Semaphore verification

## Key Features

- 🔐 Semaphore protocol for anonymous identity
- 📍 GPS-based location proof generation
- 🛡️ Zero-knowledge proofs for privacy preservation
- 📊 Real-time demographic dashboard
- 🔗 On-chain verification via smart contracts

## Project Structure

```
ns_demographics/
├── mobile/          # React Native mobile app
├── backend/         # Node.js backend API
├── dashboard/       # Web dashboard (Next.js)
├── contracts/       # Solidity smart contracts
└── shared/          # Shared types and utilities
```

## Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

Quick start:
1. Install dependencies: `npm install && npm run install:all`
2. Start MongoDB
3. Start backend: `npm run dev:backend`
4. Start dashboard: `npm run dev:dashboard`
5. Start mobile app: `npm run dev:mobile`

## Documentation

- [Setup Guide](./SETUP.md) - Detailed installation and setup instructions
- [Architecture](./ARCHITECTURE.md) - System architecture and data flow
- [Mobile App README](./mobile/README.md) - Mobile app documentation
- [Backend README](./backend/README.md) - Backend API documentation

## How It Works

1. **User creates identity**: Mobile app generates a Semaphore identity (stored securely)
2. **User proves location**: GPS location is captured and verified against network school boundaries
3. **Proof generation**: Zero-knowledge proof is created proving membership and location without revealing identity
4. **Proof submission**: Proof is sent to backend for verification
5. **Data aggregation**: Backend aggregates demographic data while preserving privacy
6. **Dashboard visualization**: Aggregated statistics are displayed on the dashboard

## Privacy Guarantees

- ✅ Individual identities are never revealed
- ✅ Demographic data is encrypted in Semaphore signals
- ✅ Only aggregated statistics are stored
- ✅ Nullifier tracking prevents double-counting without revealing identity
- ✅ Location proofs verify presence without tracking individual movements

## Technology Stack

- **Mobile**: React Native, Expo, Semaphore Protocol
- **Backend**: Node.js, Express, MongoDB
- **Dashboard**: Next.js, React, Recharts, Tailwind CSS
- **Smart Contracts**: Solidity, Hardhat, Semaphore Contracts
- **ZK Proofs**: Semaphore Protocol

## License

MIT

