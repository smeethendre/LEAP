import { db } from "../config/firebase.js";
import { writeApi } from "../config/influx.js";
import { Point } from "@influxdata/influxdb-client";
import { broadcast } from "../websocket/broadcast.js";

let lastPacketNo = 0;

const saveFirebasePacket = async (packet) => {
  const point = new Point("telemetry")
    // tags — used for filtering in queries
    .tag("hab_id", packet.HAB_ID)
    .tag("status_flag", packet.STATUS_FLAG)

    // fields — actual sensor values
    .stringField("mission_time", packet.MISSION_TIME)
    .stringField("timestamp", packet.TIMESTAMP)
    .floatField("temperature", packet.TEMPERATURE)
    .floatField("pressure", packet.PRESSURE)
    .floatField("humidity", packet.HUMIDITY)
    .floatField("uv_index", packet.UV_INDEX)
    .floatField("magnetic_field", packet.MAGNETIC_FIELD)
    .floatField("latitude", packet.LATITUDE)
    .floatField("longitude", packet.LONGITUDE)
    .floatField("altitude", packet.ALTITUDE)
    .floatField("accel_x", packet.ACCEL_X)
    .floatField("accel_y", packet.ACCEL_Y)
    .floatField("accel_z", packet.ACCEL_Z)
    .intField("packet_no", packet.PACKET_NO)
    .timestamp(new Date());

  writeApi.writePoint(point);
  await writeApi.flush();

  // broadcast to WebSocket clients (live dashboard)
  broadcast({
    habId: packet.HAB_ID,
    missionTime: packet.MISSION_TIME,
    packetNo: packet.PACKET_NO,
    temperature: packet.TEMPERATURE,
    pressure: packet.PRESSURE,
    humidity: packet.HUMIDITY,
    uvIndex: packet.UV_INDEX,
    magneticField: packet.MAGNETIC_FIELD,
    latitude: packet.LATITUDE,
    longitude: packet.LONGITUDE,
    altitude: packet.ALTITUDE,
    timestamp: packet.TIMESTAMP,
    accelX: packet.ACCEL_X,
    accelY: packet.ACCEL_Y,
    accelZ: packet.ACCEL_Z,
    statusFlag: packet.STATUS_FLAG,
  });
};

const fetchFromFirebase = async () => {
  try {
    const snapshot = await db
      .collection("packets")
      .where("PACKET_NO", ">", lastPacketNo)
      .orderBy("PACKET_NO", "asc")
      .limit(50)
      .get();

    if (snapshot.empty) {
      console.log("[Firebase] No new packets");
      return;
    }

    const packets = snapshot.docs.map((doc) => doc.data());
    let maxPacketNo = lastPacketNo;

    for (const packet of packets) {
      await saveFirebasePacket(packet);
      if (packet.PACKET_NO > maxPacketNo) {
        maxPacketNo = packet.PACKET_NO;
      }
    }

    lastPacketNo = maxPacketNo;
    console.log(
      `[Firebase] ${packets.length} packets ingested (last PACKET_NO: ${lastPacketNo})`,
    );
  } catch (error) {
    console.error("[Firebase] Fetch error:", error.message);
  }
};

export { fetchFromFirebase };


