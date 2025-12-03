# Quick Start Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB running (local or cloud)

## Installation

1. Install all dependencies:
```bash
npm install
npm run install:all
```

## Running the Project

### Option 1: Run Backend and Dashboard Together
```bash
npm run dev
```
This runs both backend (port 3001) and dashboard (port 3000) concurrently.

### Option 2: Run Everything (Backend + Dashboard + Mobile)
```bash
npm run dev:all
```

### Option 3: Run Services Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```
Backend runs on `http://localhost:3001`

**Terminal 2 - Dashboard:**
```bash
npm run dev:dashboard
```
Dashboard runs on `http://localhost:3000`

**Terminal 3 - Mobile App:**
```bash
npm run dev:mobile
```
Then scan QR code with Expo Go app on your phone.

## Setup MongoDB

Make sure MongoDB is running:

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Docker:**
```bash
docker run -d -p 27017:27017 mongo
```

**Or use MongoDB Atlas (cloud):**
Update `MONGODB_URI` in `backend/.env`

## Create Backend .env File

Create `backend/.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ns_demographics
NODE_ENV=development
```

## Create a Network School Group

Before submitting proofs, create a network school group:

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

1. **Start services**: `npm run dev`
2. **Open dashboard**: `http://localhost:3000`
3. **Open mobile app**: Run `npm run dev:mobile` and scan QR code
4. **Create identity** in mobile app
5. **Submit location proof** with demographic data
6. **View aggregated data** on dashboard

## Troubleshooting

- **MongoDB connection error**: Make sure MongoDB is running
- **Port already in use**: Change ports in `.env` files
- **Mobile app won't connect**: Check `EXPO_PUBLIC_API_URL` in mobile app matches backend URL

