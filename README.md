# LEAP — Space Club Platform

> **L**aunch · **E**volve · **A**ccelerate · **P**ioneer

A full-stack microservices platform built for LEAP, a student-run space club, to manage missions, publish team updates, and stream live telemetry from High-Altitude Balloon (HAB) and CanSat missions in real time.

---

## Overview

LEAP Platform is a two-service backend architecture designed to handle two distinct concerns — a public-facing website backend and a real-time aerospace telemetry pipeline — each with its own database, API, and deployment.

```
┌─────────────────────────────────────────────────────────────┐
│                       LEAP Platform                         │
│                                                             │
│   main-service (Node.js + MongoDB)                         │
│   → Public website API                                      │
│   → Mission catalogue, team profiles, blog                  │
│                                                             │
│   mission-service (Node.js + InfluxDB + Firebase)          │
│   → Live telemetry ingestion from HAB/CanSat missions       │
│   → Real-time WebSocket broadcast to dashboard              │
│   → Historical flight data queries                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture

### Telemetry Pipeline

```
STM32 (balloon) → LoRa 433MHz → Receiver STM32
  → USB Serial → Ground Station Laptop
    → Firebase Firestore (cloud upload)
      → mission-service polls Firebase (1s interval)
        → saves to InfluxDB Cloud (time-series storage)
        → broadcasts via WebSocket
          → live dashboard (Leaflet map + sensor charts)
```

### Services

| Service | Port | Database | Purpose |
|---|---|---|---|
| main-service | 3000 | MongoDB Atlas | Website API — missions, team, blog |
| mission-service | 3001 | InfluxDB Cloud + Firebase | Telemetry ingestion, WebSocket, live dashboard |

---

## Tech Stack

### Backend
- **Node.js** — ESM modules (`type: module`)
- **Express.js v5** — REST API
- **Mongoose** — MongoDB ODM
- **InfluxDB Client** — time-series telemetry writes and Flux queries
- **Firebase Admin SDK** — Firestore polling for ground station uploads
- **ws** — WebSocket server for live telemetry broadcast
- **jsonwebtoken + bcryptjs** — JWT authentication (mission-service)

### Databases
- **MongoDB Atlas** — mission metadata, team profiles, blog posts
- **InfluxDB Cloud** — HAB/CanSat sensor time-series data (1 packet/sec)
- **Firebase Firestore** — cloud relay between ground station and mission-service

### Infrastructure
- **Docker + Docker Compose** — containerised deployment
- **Nginx** — reverse proxy and API gateway
- **GitHub Actions** — CI/CD pipeline

---

## Project Structure

```
leap-platform/
├── main-service/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/          (Mission, Team, BlogPost)
│   │   ├── controllers/     (mission, team, blog)
│   │   ├── services/        (mission, team, blog)
│   │   ├── routes/          (mission, team, blog)
│   │   ├── middleware/      (errorHandler)
│   │   ├── utils/           (ApiError, ApiResponse, asyncHandler)
│   │   └── app.js
│   └── index.js
│
├── mission-service/
│   ├── src/
│   │   ├── config/          (influx.js, firebase.js)
│   │   ├── models/          (telemetry.fields.js)
│   │   ├── controllers/     (ingest, telemetry)
│   │   ├── services/        (cloudIngest, ingest, telemetry)
│   │   ├── routes/          (ingest, telemetry)
│   │   ├── websocket/       (wsServer, broadcast)
│   │   ├── serial/          (serialBridge, packetParser)
│   │   ├── middleware/      (auth, errorHandler)
│   │   ├── utils/           (ApiError, ApiResponse, asyncHandler)
│   │   └── app.js
│   └── index.js
│
├── nginx/nginx.conf
├── grafana/provisioning/
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

---

## API Reference

### main-service — `http://localhost:3000`

```
GET    /health
GET    /api/mission           → all missions (dropdown)
GET    /api/mission/:id       → mission detail
GET    /api/blog              → all published posts
GET    /api/blog/:id          → single post
GET    /api/team              → all active team members
GET    /api/team/:id          → single member
```

### mission-service — `http://localhost:3001`

```
POST   /api/ingest/packet             → ingest raw telemetry packet (API key required)
GET    /api/telemetry/latest          → ?habId=HAB-01
GET    /api/telemetry/packets         → ?habId=HAB-01&limit=500
GET    /api/telemetry/path            → flight path lat/lon/alt
GET    /api/telemetry/stats           → max altitude, min temp, avg RSSI
WS     ws://localhost:3001            → live telemetry stream
```

---

## Telemetry Packet Format

16-field CSV packet transmitted over LoRa 433 MHz at 1 packet/second:

```
HAB_ID, MISSION_TIME, PACKET_NO, TEMPERATURE, PRESSURE, HUMIDITY,
UV_INDEX, MAGNETIC_FIELD, LATITUDE, LONGITUDE, ALTITUDE,
TIMESTAMP, ACCEL_X, ACCEL_Y, ACCEL_Z, STATUS_FLAG
```

Example:
```
HAB-01,00:12:34,145,23.4,987.2,45.1,2.3,48.5,19.076090,72.877426,150.5,2025-01-15T10:23:45Z,0.12,-0.03,9.81,OK
```

---

## Hardware Stack

| Component | Model | Purpose |
|---|---|---|
| Microcontroller | STM32 Nucleo F303RE | Flight computer (FreeRTOS) |
| GPS | NEO-M8N / NEO-7M | Position tracking |
| LoRa Module | E32-433T30D (1W) | 433 MHz telemetry TX |
| Pressure | GY-63 MS5611 | Altitude derivation |
| Temperature | DS18B20 | Cold-soak logging |
| UV | CJMCU-GUVA-S12SD | UV irradiance |
| Magnetometer | LIS3MDLTR | Magnetic field |
| Accelerometer | ADXL345 | Vibration + orientation |
| Battery | SAFT LS14500 3.6V | Primary power |
| RTOS | FreeRTOS (CMSIS V2) | 7 concurrent tasks |

---

## Getting Started

### Prerequisites
```
Node.js v20+
MongoDB Atlas account
InfluxDB Cloud account
Firebase project with Firestore enabled
```

### Setup

```bash
# Clone
git clone https://github.com/smeethendre/LEAP.git
cd LEAP

# main-service
cd main-service
npm install
cp .env.example .env    # fill in MONGODB_URI, PORT
npm run dev

# mission-service (separate terminal)
cd mission-service
npm install
cp .env.example .env    # fill in INFLUX_*, JWT_ACCESS_SECRET
npm run dev
```

### Environment Variables

**main-service/.env**
```
PORT=3000
MONGODB_URI=mongodb+srv://...
```

**mission-service/.env**
```
PORT=3001
INFLUX_URL=https://eu-central-1-1.aws.cloud2.influxdata.com
INFLUX_TOKEN=
INFLUX_ORG=LEAP
INFLUX_BUCKET=HAB-TELEMETRY
JWT_ACCESS_SECRET=
GROUND_STATION_API_KEY=
MAIN_SERVICE_URL=http://localhost:3000
```

> `firebase-service-account.json` must be placed in `mission-service/` root. Never commit this file.

---

## Mission: HAB-01

HAB-01 is LEAP's inaugural High-Altitude Balloon mission targeting 30–35 km stratospheric altitude. The platform was built specifically to support this mission with live telemetry tracking, flight path visualisation, and post-flight data analysis.

The mission also implements the **HLCI-TP framework** — a dimensionless composite index (Coffin-Manson + Arrhenius + Beer-Lambert) that quantifies how much of the LEO orbital stress environment a balloon flight replicates, serving as a low-cost CubeSat pre-qualification tool.

---

## Team

**LEAP** — student space club, 6 members (expanding)

> Launch · Evolve · Accelerate · Pioneer

---

## License

MIT
