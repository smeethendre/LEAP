import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { WebSocketServer } from "ws";
import http from "http";
import fs from "fs";
import path from "path";

// ── Config ──────────────────────────────────────────────
const SERIAL_PORT = "/dev/ttyUSB0"; // Windows → 'COM3', Mac → '/dev/cu.usbmodem...'
const BAUD_RATE = 115200;
const WS_PORT = 8765;
// ────────────────────────────────────────────────────────

// 1. Open serial port
const port = new SerialPort({ path: SERIAL_PORT, baudRate: BAUD_RATE });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

port.on("open", () => console.log(`[Serial] Connected on ${SERIAL_PORT}`));
port.on("error", (err) => console.error("[Serial] Error:", err.message));

// 2. WebSocket server
const wss = new WebSocketServer({ port: WS_PORT });
console.log(`[WS] Listening on ws://localhost:${WS_PORT}`);

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}

wss.on("connection", (ws, req) => {
  console.log(`[WS] Client connected: ${req.socket.remoteAddress}`);
  // Send last known position immediately on connect
  if (lastFix) ws.send(JSON.stringify(lastFix));
});

// 3. Parse incoming NMEA/custom sentence and broadcast
// Expects: $GPS,lat,lon,alt,sats,spd*\r\n
let lastFix = null;

parser.on("data", (line) => {
  console.log("[Raw]", line);

  try {
    if (line.startsWith("$GPS")) {
      const fix = parseCustom(line);
      if (fix) {
        lastFix = fix;
        broadcast(fix);
      }
    } else if (line.startsWith("$GPGGA") || line.startsWith("$GNGGA")) {
      const fix = parseGPGGA(line); // direct NMEA from NEO-8M
      if (fix) {
        lastFix = fix;
        broadcast(fix);
      }
    }
  } catch (e) {
    console.warn("[Parse] Bad line:", line, e.message);
  }
});

// ── Parsers ──────────────────────────────────────────────

function parseCustom(line) {
  // $GPS,19.076090,72.877426,120.5,9,14.2*
  const parts = line.replace("*", "").split(",");
  if (parts.length < 5) return null;
  return {
    lat: parseFloat(parts[1]),
    lon: parseFloat(parts[2]),
    alt: parseFloat(parts[3]),
    sats: parseInt(parts[4]),
    spd: parts[5] ? parseFloat(parts[5]) : 0,
    ts: Date.now(),
  };
}

function parseGPGGA(sentence) {
  // $GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47
  const p = sentence.split(",");
  if (!p[2] || !p[4]) return null;

  const lat = nmeaToDecimal(p[2], p[3]);
  const lon = nmeaToDecimal(p[4], p[5]);
  const fixQuality = parseInt(p[6]);
  if (fixQuality === 0 || isNaN(lat) || isNaN(lon)) return null;

  return {
    lat,
    lon,
    alt: parseFloat(p[9]) || 0,
    sats: parseInt(p[7]) || 0,
    spd: 0, // GPGGA has no speed; use $GPRMC for that
    ts: Date.now(),
  };
}

function nmeaToDecimal(raw, dir) {
  // NMEA format: DDDMM.MMMM → decimal degrees
  const dot = raw.indexOf(".");
  const deg = parseFloat(raw.slice(0, dot - 2));
  const min = parseFloat(raw.slice(dot - 2));
  let dec = deg + min / 60;
  if (dir === "S" || dir === "W") dec = -dec;
  return dec;
}
