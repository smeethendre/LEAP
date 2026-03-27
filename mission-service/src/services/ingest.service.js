import { db } from "../config/firebase.js";
import { savePacketService } from "./ingest.service.js";

let lastPacketNo = 0; 

const fetchFromFirebase = async () => {
  try {
    const snapshot = await db
      .collection("packets")
      .where("packetNo", ">", lastPacketNo)
      .orderBy("packetNo")
      .limit(50)
      .get();

    if (snapshot.empty) {
      console.log("[INGEST] No new packets");
      return;
    }

    const packets = [];

    snapshot.forEach((doc) => {
      packets.push(doc.data());
    });

    for (const packet of packets) {
      await savePacketService(packet);
      lastPacketNo = packet.packetNo;
    }

    console.log(`[INGEST] ${packets.length} packets saved`);
  } catch (error) {
    console.error("[INGEST] Firebase fetch error:", error.message);
  }
};

export { fetchFromFirebase };
